/**
 * updatecostCostMPJarvis
 */

function updatecostCostMPJarvis() {
  const _requestData = ({ year, month }, callback) => {
    const data = this.getModule('jarvis')().request.get(
      '/sheets/campaign/costs/ua',
      {},
      {
        year,
        month,
      }
    );

    if (!Array.isArray(data)) return;

    callback(data);
  };

  const ss = SpreadsheetApp.getActive();

  const margem = ss.getSheetByName('Margem');

  const year = margem.getRange('A11').getValue();
  const month = margem.getRange('A14').getValue()?.toString().padStart(2, '0');

  _requestData({ year, month }, (data) => {
    const rows = [];

    data.forEach((item) => {
      item?.subcampaigns.forEach((subcampaign) => {
        rows.push([
          subcampaign?.costs?.period?.split('T')?.[0],
          subcampaign?.costs?.period?.split('T')?.[0],
          item._id,
          item.name,
          item.currency,
          subcampaign?.costs?.manual_cost,
          subcampaign?.costs?.deduction,
          item?.costModels?.join(','),
          `${subcampaign?.account?.businessName}_${subcampaign?.account?.product}_${item.currency}`,
          subcampaign?.account?.geography,
          subcampaign?.account?.name,
          subcampaign?.mobileApp?.platform,
          subcampaign?.campaign?.strategist,
        ]);
      });
    });

    // RESET
    const sheet = ss.getSheetByName('Cost_MP');
    sheet.getRange('A2:M').clearContent();

    // Apply values
    if (rows.length) {
      const range = sheet.getRange('A2:M' + (2 + rows.length - 1));
      range.setValues(rows);
    }
  });
}
