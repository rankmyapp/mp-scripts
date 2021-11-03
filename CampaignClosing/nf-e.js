/**
 * updateNFeJarvis
 */

function updateNFeJarvis() {
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
  const margem = ss.getSheetByName('Margem');

  const year = margem.getRange('A11').getValue();
  const month = margem.getRange('A14').getValue()?.toString().padStart(2, '0');

  _requestData({ year, month }, (data) => {
    const rows = [];

    data.forEach((item) => {
      const period = item.budget?.period?.split('T');

      rows.push([
        item._id,
        item.status,
        `${item.account?.businessName}_${item.account?.product}_${item.currency}`,
        item.account?.name,
        item.account?.product,
        item.account?.businessName,
        period,
        period,
        item.currency,
        item.budget?.initialValue,
        item.budget?.extraBudget,
        item.budget?.deduction,
        item.budget?.revenueChurn,
        item.budget?.invoice,
        item.budget?.isInvoiceApproved === 1 ? 'Sim' : 'Não',
        item.accountManager,
        item.strategist,
        item.accountAffiliate,
      ]);
    });

    // RESET
    const sheet = ss.getSheetByName('NF_MP');
    sheet.getRange('A2:R').clearContent();

    // Apply values
    if (rows.length) {
      const range = sheet.getRange('A2:R' + (2 + rows.length - 1));
      range.setValues(rows);
    }
  });
}
