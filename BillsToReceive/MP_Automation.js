/**
 * updateMPAutomationJarvis
 */

function updateMPAutomationJarvis() {
  const _requestData = ({ year, month }, callback) => {
    const data = this.getModule('jarvis')().request.get(
      '/sheets/nf-e/:year/:month',
      {
        year,
        month,
      }
    );

    if (!Array.isArray(data)) return;

    callback(data);
  };

  const ss = SpreadsheetApp.getActive();

  const automation = ss.getSheetByName('Automacao');

  const year = automation.getRange('A2').getValue();
  const month = automation
    .getRange('B2')
    .getValue()
    ?.toString()
    .padStart(2, '0');

  _requestData({ year, month }, (data) => {
    const rows = [];

    data.forEach((item) => {
      const period = item.budget?.period?.split('T')?.[0] || '';
      const [year, month] = period.split('-');
      const isNextYear = parseInt(month) + 1 >= 13;
      const nextMonth = isNextYear ? 1 : parseInt(month) + 1;

      rows.push([
        `${01}-${month}-${year}`,
        isNextYear ? parseInt(year) + 1 : year,
        month,
        nextMonth,
        item._id,
        item.account?.businessName,
        item.account?.name,
        item.budget?.isInvoiceApproved === 1 ? 'Sim' : 'Não',
        item.currency,
        item.budget?.invoice,
      ]);
    });

    // RESET
    const sheet = ss.getSheetByName('Automacao_MP');
    sheet.getRange('A2:J').clearContent();

    // Apply values
    if (rows.length) {
      const range = sheet.getRange('A2:J' + (2 + rows.length - 1));
      range.setValues(rows);
    }
  });
}
