/**
 * Planilha que utiliza esse Script:
 * https://docs.google.com/spreadsheets/d/1sFDLPSfTEaO0kbuBDxDEkZbjrahxZYJR2NS-mQ0Li8A/edit#gid=1383381631
 */

const fs = require('fs');
const Ultron = require('../Ultron');

Ultron.minify({
  files: [
    fs.readFileSync(__dirname + '/MP_Automation.js', 'utf8'),
    fs.readFileSync(__dirname + '/currencies.js', 'utf8'),
  ],
  output: 'billsToReceive.js',
});
