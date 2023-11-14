/**
 * updateTSIJarvis
 */

function updateTSIJarvis() {
  const _handleResetRows = (table) => {
    if (
      table !== this.GLOBAL.context.ANDROID &&
      table !== this.GLOBAL.context.IOS
    )
      return;

    const ss = SpreadsheetApp.getActive();
    const sheetCanalDevice = ss.getSheetByName(
      table === this.GLOBAL.context.ANDROID ? 'Canais Android' : 'Canais iOS'
    );

    sheetCanalDevice.getRange('A3:J').clearContent();
    sheetCanalDevice.getRange('N1:N8').clearContent();
  };

  /**
   * Apply data in the Table Canais Android or Canais iOS
   *
   * @param {string} table The table name (ANDROID or iOS).
   * @param {array} rows The map with data to apply
   * @param {any} data The data of API
   * @return void
   * @customfunction
   */
  const _applyDataOnTable = (table) => {
    return (rows, data) => {
      if (
        table !== this.GLOBAL.context.ANDROID &&
        table !== this.GLOBAL.context.IOS
      )
        return;

      _handleResetRows(table);

      const ss = SpreadsheetApp.getActive();
      const sheetCanalDevice = ss.getSheetByName(
        table === this.GLOBAL.context.ANDROID ? 'Canais Android' : 'Canais iOS'
      );

      if (rows.length) {
        const range = sheetCanalDevice.getRange('A3:J' + (3 + rows.length - 1));
        range.setValues(rows);
      }

      const sheetCampaignInfo = sheetCanalDevice.getRange('N1:N8');

      sheetCampaignInfo.setValues([
        [data.campaign.tokens],
        [new Date(data.campaign.startDate)],
        [new Date(data.campaign.endDate)],
        [data.campaign.payout || ''],
        [data.campaign.currency],
        [data.campaign.costModel],
        [data.campaign.budgetTotal],
        [data.app?.bundle],
      ]);
      this.getModule('jarvis')().showFeedback({
        suffix: 'Traffic Source Instances',
        description:
          'Canais ' +
          table +
          ' atualizado. \n\n' +
          rows.length +
          ' linhas encontradas.',
      });
    };
  };

  /**
   * Get data from Jarvis API
   *
   * @param {string} campaignID The ID of campaign
   * @param {_applyDataOnTable} callback The callback to apply data in the table
   * @return void
   * @customfunction
   */
  const _requestTrafficSourceInstance = (campaignID, callback) => {
    const data = this.getModule('jarvis')().request.get(
      '/sheets/traffic-source-instance/campaign/:id',
      {
        id: campaignID,
      }
    );
    if (typeof data !== 'object') return;

    const tsi = data.trafficSourcesInstances || [];
    const rows = [];

    tsi.forEach(function (t) {
      const payoutLength = t.eventsPayouts.length;
      const tsiEndDate = new Date(t.endDate);
      let currentPayout = 0;
      t.eventsPayouts.forEach(function (variation) {
        //Reset hours
        const startDate = new Date(variation.effectiveDate);
        startDate.setHours(0, 0, 0, 0);

        let endDate;

        if (currentPayout === payoutLength - 1) {
          endDate = new Date(t.eventsPayouts[currentPayout + 1].effectiveDate);
          endDate.setHours(0, 0, 0, 0);
        } else {
          endDate = tsiEndDate;
          endDate.setHours(0, 0, 0, 0);
        }

        rows.push([
          t.channel,
          t.costModel,
          variation.value,
          startDate,
          endDate,
          t.currency || data.campaign.currency,
          variation.dailyCap,
          t.tokens,
          variation.event,
          t.status,
        ]);

        currentPayout++;
      });
    });

    callback(rows, { campaign: data.campaign, app: data.app });
  };

  const ss = SpreadsheetApp.getActive();

  const campaignIDANDROID = ss
    .getSheetByName('Android')
    .getRange('C2')
    .getValue();

  const campaignIDiOS = ss.getSheetByName('iOS').getRange('C2').getValue();

  if (campaignIDANDROID) {
    _requestTrafficSourceInstance(
      campaignIDANDROID,
      _applyDataOnTable(this.GLOBAL.context.ANDROID)
    );
  } else {
    _handleResetRows(this.GLOBAL.context.ANDROID);

    this.getModule('jarvis')().showFeedback({
      suffix: 'Traffic Source Instances',
      description: 'É necessário adicionar o ID Jarvis (B2) na página Android.',
      fail: true,
      toast: true,
    });
  }

  if (campaignIDiOS) {
    _requestTrafficSourceInstance(
      campaignIDiOS,
      _applyDataOnTable(this.GLOBAL.context.IOS)
    );
  } else {
    _handleResetRows(this.GLOBAL.context.IOS);

    this.getModule('jarvis')().showFeedback({
      suffix: 'Traffic Source Instances',
      description: 'É necessário adicionar o ID Jarvis (B2) na página iOS.',
      fail: true,
      toast: true,
    });
  }
}
