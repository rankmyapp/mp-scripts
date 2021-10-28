/**
 * updateCurrenciesJarvis
 */

function updateCurrenciesJarvis() {
  const _requestData = ({ year }, callback) => {
    const data = this.getModule('jarvis')().request.get(
      '/sheets/currencies/:year/',
      {
        year,
      }
    );

    if (!Array.isArray(data)) return;

    callback(data);
  };

  const ss = SpreadsheetApp.getActive();

  const margem = ss.getSheetByName('Margem');

  const year = margem.getRange('A11').getValue();

  _requestData({ year }, (data) => {
    const rows = [];

    data.forEach((item) => {
      rows.push([item.year, item.month, item.usd, item.mxn]);
    });

    // RESET
    const sheet = ss.getSheetByName('currency');
    sheet.getRange('A2:D').clearContent();

    // Apply values
    if (rows.length) {
      const range = sheet.getRange('A2:D' + (2 + rows.length - 1));
      range.setValues(rows);
    }
  });
}
