function updateConversions(ctx) {
  if (
    ctx !== this.GLOBAL.context.APPSFLYER &&
    ctx !== this.GLOBAL.context.TRACKIER
  )
    return;

  this.addModule('media', {
    url_base: 'https://jarvis-gateway.rankmyapp.com/provider',
    headers: {
      Authorization: '<token>',
    },
  });

  const tableUtil = this.getUtil('table')();

  const ALIAS = {
    configurationSheet: 'configuration_' + ctx,
    dashboardAndroidSheet: 'dashboard_' + ctx + '_android',
    dashboardiOSSheet: 'dashboard_' + ctx + '_ios',
    canaisAndroid: 'Canais Android',
    canaisIOS: 'Canais iOS',
  };

  const _getFiltersNames = () => {
    const cell = tableUtil.findCellByText('filtro_appsflyer', 'Event Filter');
    if (!cell) return [];

    const appsflyer = ss.getSheetByName('filtro_appsflyer');
    const range = appsflyer.getRange(cell.row + 1, cell.column, 20);

    return range
      .getValues()
      .filter((v) => Array.isArray(v) && v.length && v[0])
      .map((v) => v[0]);
  };

  const _filterEvents = (data) => {
    if (ctx !== this.GLOBAL.context.APPSFLYER) return data;

    const IGNORE_COLUMNS = [
      'campaign_id',
      'publish_name',
      'created',
      'country',
      'channel',
      'media_source',
      'impressions',
      'clicks',
      'ctr',
      'installs',
      'install',
      'conversion_rate',
    ];

    const filters = _getFiltersNames();

    const values = [...IGNORE_COLUMNS, ...filters];

    if (values.length === IGNORE_COLUMNS.length) return data;

    return data.reduce((acc, curr) => {
      const newRow = {};

      values.forEach((v) => {
        if (curr.hasOwnProperty(v)) {
          newRow[v] = curr[v];
        }
      });

      return [...acc, newRow];
    }, []);
  };

  const _applyDataOnTable = ({
    campaignIDAndroid,
    campaignIDiOS,
    contextApplyData,
  }) => {
    return (data) => {
      const androidIds = (campaignIDAndroid || '')
        .replace(/@/g, ',')
        .split(',');
      const iOSIds = (campaignIDiOS || '').replace(/@/g, ',').split(',');

      const dataAndroid = _filterEvents(
        data.filter((v) =>
          androidIds.find((id) => parseInt(id) == parseInt(v.campaign_id))
        )
      );
      const dataiOS = _filterEvents(
        data.filter((v) =>
          iOSIds.find((id) => parseInt(id) === parseInt(v.campaign_id))
        )
      );

      const ss = SpreadsheetApp.getActive();
      const sheetAndroid = ss.getSheetByName(ALIAS.dashboardAndroidSheet);
      const sheetiOS = ss.getSheetByName(ALIAS.dashboardiOSSheet);

      // is_primary_attribution must is always in position 9
      const orderOfColumns = {
        names: [
          'created',
          'country',
          'media_source',
          'revenue',
          'revenueWithDuplicates',
          'install',
          'uninstall',
          'is_primary_attribution',
        ],
        positions: [2, 3, 4, 5, 6, 7, 8, 9],
      };

      if (dataAndroid.length) {
        sheetAndroid
          .getRange(
            1,
            1,
            sheetAndroid.getMaxRows(),
            sheetAndroid.getMaxColumns()
          )
          .clearContent();

        // Persist the columns always in position
        const columns = tableUtil.persistPosition(
          tableUtil.generateColumns(dataAndroid),
          orderOfColumns.names,
          orderOfColumns.positions
        );

        const rangeAndroid = sheetAndroid.getRange(
          1,
          1,
          dataAndroid.length + 1,
          columns.length + 1
        );

        rangeAndroid.setValues([
          ['source', ...columns],
          ...dataAndroid.map((v) => [ctx, ...columns.map((c) => v[c])]),
        ]);

        this.getModule('media')().showFeedback({
          suffix: ctx.charAt(0).toUpperCase() + ctx.slice(1),
          description:
            ALIAS.dashboardAndroidSheet +
            ' recebeu ' +
            dataAndroid.length +
            ' linha(s).',
        });
      } else if (
        !dataAndroid.length &&
        contextApplyData === this.GLOBAL.context.ANDROID
      ) {
        sheetAndroid
          .getRange(
            2,
            1,
            sheetAndroid.getMaxRows(),
            sheetAndroid.getMaxColumns()
          )
          .clearContent();

        this.getModule('media')().showFeedback({
          suffix: ctx.charAt(0).toUpperCase() + ctx.slice(1),
          description:
            ALIAS.dashboardAndroidSheet +
            ' recebeu ' +
            dataAndroid.length +
            ' linha(s).',
        });
      }

      if (dataiOS.length) {
        sheetiOS
          .getRange(1, 1, sheetiOS.getMaxRows(), sheetiOS.getMaxColumns())
          .clearContent();

        // Persist the columns always in position
        const columns = tableUtil.persistPosition(
          tableUtil.generateColumns(dataiOS),
          orderOfColumns.names,
          orderOfColumns.positions
        );

        const rangeiOS = sheetiOS.getRange(
          1,
          1,
          dataiOS.length + 1,
          columns.length + 1
        );

        rangeiOS.setValues([
          ['source', ...columns],
          ...dataiOS.map((v) => [ctx, ...columns.map((c) => v[c])]),
        ]);

        this.getModule('media')().showFeedback({
          suffix: ctx.charAt(0).toUpperCase() + ctx.slice(1),
          description:
            ALIAS.dashboardiOSSheet +
            ' recebeu ' +
            dataiOS.length +
            ' linha(s).',
        });
      } else if (
        !dataiOS.length &&
        contextApplyData === this.GLOBAL.context.IOS
      ) {
        sheetiOS
          .getRange(2, 1, sheetiOS.getMaxRows(), sheetiOS.getMaxColumns())
          .clearContent();

        this.getModule('media')().showFeedback({
          suffix: ctx.charAt(0).toUpperCase() + ctx.slice(1),
          description:
            ALIAS.dashboardiOSSheet +
            ' recebeu ' +
            dataiOS.length +
            ' linha(s).',
        });
      }
    };
  };

  const _requestData = (queryParams, callback) => {
    if (!queryParams.campaignIds) {
      callback([]);
    } else {
      const data = this.getModule('media')().request.get(
        '/' + ctx,
        {},
        queryParams
      );
      if (!data) return;

      callback(data);
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

  const filterEvents = _getFiltersNames();

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
    withDuplicate: true,
    country: true,
    orderDirection: 'asc',
    eventNames: filterEvents.length ? filterEvents.join(',') : undefined,
  };

  const campaignID = (id) =>
    [id]
      .filter((v) => !!v)
      .join(',')
      .replace(/@/g, ',')
      .replace(/\s/g, '');

  const campaignString = (id) => (typeof id === 'number' ? id.toString() : id);

  const androidRequest = _requestData(
    { ...queryParams, campaignIds: campaignID(campaignIDAndroid) },
    _applyDataOnTable({
      campaignIDAndroid: campaignString(campaignIDAndroid),
      contextApplyData: this.GLOBAL.context.ANDROID,
    })
  );

  const iOSRequest = _requestData(
    { ...queryParams, campaignIds: campaignID(campaignIDiOS) },
    _applyDataOnTable({
      campaignIDiOS: campaignString(campaignIDiOS),
      contextApplyData: this.GLOBAL.context.IOS,
    })
  );

  Promise.all([androidRequest, iOSRequest]);
}
