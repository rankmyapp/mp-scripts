/**
 * updatecostUA_RTGJarvis
 */

function updatecostUA_RTGJarvis() {
  const _requestData = ({ year, month }, callback) => {
    const data = this.getModule('jarvis')().request.get(
      '/sheets/campaign/costs/extra',
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
      rows.push([
        item.campaign_id,
        item.period?.split('T')?.[0] || null,
        item.month,
        item.year,
        item.manual_cost,
        item.deduction,
        item.currency,
      ]);
    });

    // RESET
    const sheet = ss.getSheetByName('Cost_ASA.RTG');
    sheet.getRange('A2:G').clearContent();

    // Apply values
    if (rows.length) {
      const range = sheet.getRange('A2:G' + (2 + rows.length - 1));
      range.setValues(rows);
    }
  });
}
