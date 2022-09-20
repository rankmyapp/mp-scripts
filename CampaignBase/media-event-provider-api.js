function selectAppsflyerLeanSource() {
  const ui = SpreadsheetApp.getUi();

  const result = ui.alert(
    "Dados Consolidados",
    `Atualmente estamos realizando testes em uma nova forma de processar e armazenar os dados do Appsflyer. Recomenda-se usar \
    a nova fonte de dados, mas caso queira continuar usando a fonte antiga (principalmente para comparar valores), clique em "Não"\n
    Sim = Consultar usando a nova fonte de dados.
    Não = Consultar usando a antiga fonte de dados.
    `,
    ui.ButtonSet.YES_NO
  );

  return result === ui.Button.NO ? "lean-jarvis" : "lean";
}

function updateConversions(ctx) {
  if (
    ctx !== this.GLOBAL.context.APPSFLYER &&
    ctx !== this.GLOBAL.context.TRACKIER
  )
    return;

  let appsflyerLeanSourcePath;
  if (ctx === this.GLOBAL.context.APPSFLYER) {
    appsflyerLeanSourcePath = selectAppsflyerLeanSource();
  }

  const tableUtil = this.getUtil("table")();

  const ALIAS = {
    configurationSheet: "configuration_" + ctx,
    dashboardAndroidSheet: "dashboard_" + ctx + "_android",
    dashboardiOSSheet: "dashboard_" + ctx + "_ios",
    canaisAndroid: "Canais Android",
    canaisIOS: "Canais iOS",
  };

  const _getFiltersNames = () => {
    const cell = tableUtil.findCellByText("filtro_appsflyer", "Event Filter");
    if (!cell) return [];

    const appsflyer = ss.getSheetByName("filtro_appsflyer");
    const range = appsflyer.getRange(cell.row + 1, cell.column, 20);

    return range
      .getValues()
      .filter((v) => Array.isArray(v) && v.length && v[0])
      .map((v) => v[0]);
  };

  const _filterEvents = (data) => {
    if (ctx !== this.GLOBAL.context.APPSFLYER) return data;

    const IGNORE_COLUMNS = [
      "campaign_id",
      "publish_name",
      "created",
      "country",
      "channel",
      "media_source",
      "impressions",
      "clicks",
      "ctr",
      "installs",
      "install",
      "conversion_rate",
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
      const androidIds = (campaignIDAndroid || "")
        .replace(/@/g, ",")
        .split(",");
      const iOSIds = (campaignIDiOS || "").replace(/@/g, ",").split(",");

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
          "created",
          "country",
          "media_source",
          "revenue",
          "revenueWithDuplicates",
          "install",
          "uninstall",
          "is_primary_attribution",
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
          ["source", ...columns],
          ...dataAndroid.map((v) => [ctx, ...columns.map((c) => v[c])]),
        ]);

        this.getModule("media")().showFeedback({
          suffix: ctx.charAt(0).toUpperCase() + ctx.slice(1),
          description:
            ALIAS.dashboardAndroidSheet +
            " recebeu " +
            dataAndroid.length +
            " linha(s).",
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

        this.getModule("media")().showFeedback({
          suffix: ctx.charAt(0).toUpperCase() + ctx.slice(1),
          description:
            ALIAS.dashboardAndroidSheet +
            " recebeu " +
            dataAndroid.length +
            " linha(s).",
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
          ["source", ...columns],
          ...dataiOS.map((v) => [ctx, ...columns.map((c) => v[c])]),
        ]);

        this.getModule("media")().showFeedback({
          suffix: ctx.charAt(0).toUpperCase() + ctx.slice(1),
          description:
            ALIAS.dashboardiOSSheet +
            " recebeu " +
            dataiOS.length +
            " linha(s).",
        });
      } else if (
        !dataiOS.length &&
        contextApplyData === this.GLOBAL.context.IOS
      ) {
        sheetiOS
          .getRange(2, 1, sheetiOS.getMaxRows(), sheetiOS.getMaxColumns())
          .clearContent();

        this.getModule("media")().showFeedback({
          suffix: ctx.charAt(0).toUpperCase() + ctx.slice(1),
          description:
            ALIAS.dashboardiOSSheet +
            " recebeu " +
            dataiOS.length +
            " linha(s).",
        });
      }
    };
  };

  const _requestData = (queryParams, callback) => {
    if (!queryParams.campaignIds) {
      callback([]);
    } else {
      const extraPath =
        ctx === this.GLOBAL.context.APPSFLYER
          ? appsflyerLeanSourcePath
          : "lean";

      const path = `/${ctx}/${extraPath}`;
      const data = this.getModule("media")().request.get(path, {}, queryParams);
      if (!data) return;

      callback(data);
    }
  };

  /**
   *
   * @param {Date} start month start
   * @param {Date} end month end
   * @param {number} interval interval of days
   * @param {{start: Date, end: Date}[]} result intervals
   *
   * @returns {{start: Date, end: Date}[]} returns the intervals
   */
  const intervalsOfMonth = (start, end, interval, result) => {
    const newEnd = new Date(start);
    newEnd.setDate(newEnd.getDate() + interval);

    const data = {
      start,
      end: newEnd,
    };

    if (newEnd >= end)
      return [
        ...result,
        {
          start,
          end,
        },
      ];

    const newStart = new Date(newEnd);
    newStart.setDate(newStart.getDate() + 1);

    return intervalsOfMonth(newStart, end, interval, [...result, data]);
  };

  const ss = SpreadsheetApp.getActive();

  const campaignIDAndroid = ss
    .getSheetByName(ALIAS.canaisAndroid)
    .getRange("N1")
    .getValue();

  const campaignIDiOS = ss
    .getSheetByName(ALIAS.canaisIOS)
    .getRange("N1")
    .getValue();

  const dateAndroid = ss
    .getSheetByName(ALIAS.canaisAndroid)
    .getRange("N2")
    .getValue();
  const dateIOS = ss.getSheetByName(ALIAS.canaisIOS).getRange("N2").getValue();

  if (!(dateAndroid instanceof Date) && !(dateIOS instanceof Date)) {
    this.getModule("media")().showFeedback({
      suffix: ctx.charAt(0).toUpperCase() + ctx.slice(1),
      description:
        ALIAS.canaisAndroid +
        " e " +
        ALIAS.canaisIOS +
        " possuem uma data de início inválida ou não definida.\n\n Dica: Use o Media Automation Jarvis para atualizar as datas.",
    });
    return;
  }

  const campaignID = (id) =>
    [id]
      .filter((v) => !!v)
      .join(",")
      .replace(/@/g, ",")
      .replace(/\s/g, "");

  const campaignString = (id) => (typeof id === "number" ? id.toString() : id);

  /**
   *
   * @param {Date} value
   *
   * @returns string
   */
  const getFormattedDate = (value) =>
    [
      value.getFullYear(),
      (value.getMonth() + 1).toString().padStart(2, "0"),
      value.getDate().toString().padStart(2, "0"),
    ].join("-");

  const month = dateAndroid ? dateAndroid.getMonth() : dateIOS.getMonth();
  const year = dateAndroid ? dateAndroid.getFullYear() : dateIOS.getFullYear();

  const dateOfSheet = new Date(year, month + 1, 0);
  const campaignStartDate = new Date(
    dateOfSheet.getFullYear(),
    dateOfSheet.getMonth(),
    1
  );
  const campaignEndDate = dateOfSheet;

  const filterEvents = _getFiltersNames();

  const queryParams = {
    withDuplicate: true,
    country: true,
    orderDirection: "asc",
    eventNames: filterEvents.length ? filterEvents.join(",") : undefined,
  };

  /**
   *
   * @param {string} campaignIds Uma string com os ID's/token da campanha: Ex: 120,244,600
   * @param {Date} start Início da Campanha
   * @param {*} end Fim da campanha
   *
   * @returns Retorna uma lista de request
   */
  const requests = (campaignIds, start, end) => {
    return intervalsOfMonth(start, end, 10, []).map(
      ({ start, end }) =>
        new Promise((resolve) => {
          _requestData(
            {
              ...queryParams,
              start: getFormattedDate(start),
              end: getFormattedDate(end),
              campaignIds: campaignID(campaignIds),
            },
            (response) => {
              if (!Array.isArray(response)) return resolve({});
              resolve(response);
            }
          );
        })
    );
  };

  const requestsAndroid = requests(
    campaignIDAndroid,
    campaignStartDate,
    campaignEndDate
  );

  const requestsIOS = requests(
    campaignIDiOS,
    campaignStartDate,
    campaignEndDate
  );

  Promise.all(requestsAndroid).then((response) => {
    const data = Array.isArray(response) ? response : [];

    _applyDataOnTable({
      campaignIDAndroid: campaignString(campaignIDAndroid),
      contextApplyData: this.GLOBAL.context.ANDROID,
    })(data.flat());
  });

  Promise.all(requestsIOS).then((response) => {
    const data = Array.isArray(response) ? response : [];

    _applyDataOnTable({
      campaignIDiOS: campaignString(campaignIDiOS),
      contextApplyData: this.GLOBAL.context.IOS,
    })(data.flat());
  });
}
