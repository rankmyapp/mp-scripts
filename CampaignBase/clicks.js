function updateClicks(ctx) {
  if (
    ctx !== this.GLOBAL.context.APPSFLYER &&
    ctx !== this.GLOBAL.context.TRACKIER
  )
    return;

  const tableUtil = this.getUtil('table')();

  const ALIAS = {
    canaisAndroid: 'Canais Android',
    canaisIOS: 'Canais iOS',
    clicks_trackier: 'clicks_trackier',
  };

  const _applyDataOnTable = () => {
    return (clicksData) => {
      const ss = SpreadsheetApp.getActive();
      const sheet = ss.getSheetByName(ALIAS.clicks_trackier);

      if (clicksData.length) {
        sheet
          .getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns())
          .clearContent();

        // is_primary_attribution must is always in position 9
        const orderOfColumns = {
          names: ['source', 'campaign_id', 'publisher', 'clicks', 'date', 'OS'],
          positions: [0, 1, 2, 3, 4, 5],
        };

        // Persist the columns always in position
        const columns = tableUtil.persistPosition(
          tableUtil.generateColumns(clicksData),
          orderOfColumns.names,
          orderOfColumns.positions
        );

        const rangeSheet = sheet.getRange(
          1,
          1,
          clicksData.length + 1,
          columns.length
        );

        rangeSheet.setValues([
          columns,
          ...clicksData.map((v) => [...columns.map((c) => v[c])]),
        ]);

        this.getModule('media')().showFeedback({
          suffix: ctx.charAt(0).toUpperCase() + ctx.slice(1),
          description:
            ALIAS.clicks_trackier +
            ' recebeu ' +
            clicksData.length +
            ' linha(s).',
        });
      } else if (!clicksData.length) {
        sheet
          .getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns())
          .clearContent();

        this.getModule('media')().showFeedback({
          suffix: ctx.charAt(0).toUpperCase() + ctx.slice(1),
          description:
            ALIAS.clicks_trackier +
            ' recebeu ' +
            clicksData.length +
            ' linha(s).',
        });
      }
    };
  };

  const _requestData = (queryParams, callback) => {
    if (!queryParams.campaignToken || !queryParams.campaignToken?.length) {
      callback([]);
    } else {
      const data = this.getModule('media')().request.get(
        '/trackier/first-click-grouped',
        {},
        queryParams
      );

      if (!data) return;

      callback(data?.campaigns ?? []);
    }
  };

  const ss = SpreadsheetApp.getActive();

  const campaignIDAndroid = ss
    .getSheetByName(ALIAS.canaisAndroid)
    .getRange('N1')
    .getValue();

  const campaignIDiOS = ss
    .getSheetByName(ALIAS.canaisIOS)
    .getRange('N1')
    .getValue();

  const dateAndroid = ss
    .getSheetByName(ALIAS.canaisAndroid)
    .getRange('N2')
    .getValue();

  const dateIOS = ss.getSheetByName(ALIAS.canaisIOS).getRange('N2').getValue();

  if (!(dateAndroid instanceof Date) && !(dateIOS instanceof Date)) {
    this.getModule('media')().showFeedback({
      suffix: ctx.charAt(0).toUpperCase() + ctx.slice(1),
      description:
        ALIAS.canaisAndroid +
        ' e ' +
        ALIAS.canaisIOS +
        ' possuem uma data de início inválida ou não definida.\n\n Dica: Use o Media Automation Jarvis para atualizar as datas.',
    });
    return;
  }

  const month = dateAndroid ? dateAndroid.getMonth() : dateIOS.getMonth();
  const year = dateAndroid ? dateAndroid.getFullYear() : dateIOS.getFullYear();

  const date = new Date(year, month + 1, 0);

  const campaignIDs = (id) =>
    [id]
      .join(',')
      .replace(/@/g, ',')
      .replace(/\s/g, '')
      .split(',')
      .filter((v) => !!v);

  const queryParams = {
    start: [
      date.getFullYear(),
      (date.getMonth() + 1).toString().padStart(2, '0'),
      '01',
    ].join('-'),
    end: [
      date.getFullYear(),
      (date.getMonth() + 1).toString().padStart(2, '0'),
      date.getDate().toString().padStart(2, '0'),
    ].join('-'),
  };

  const data = [];

  const androidRequest = _requestData(
    { ...queryParams, campaignToken: campaignIDs(campaignIDAndroid) },
    (response) => {
      if (!Array.isArray(response)) return;
      data.push(
        ...response.map((item) => ({
          ...item,
          source: ctx,
          OS: this.GLOBAL.context.ANDROID,
        }))
      );
    }
  );

  const iOSRequest = _requestData(
    { ...queryParams, campaignToken: campaignIDs(campaignIDiOS) },
    (response) => {
      if (!Array.isArray(response)) return;
      data.push(
        ...response.map((item) => ({
          ...item,
          source: ctx,
          OS: this.GLOBAL.context.IOS,
        }))
      );
    }
  );

  Promise.all([androidRequest, iOSRequest]).then(() => {
    _applyDataOnTable()(data);
  });
}
