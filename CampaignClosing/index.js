/**
 * Planilha que utiliza esse Script:
 * https://docs.google.com/spreadsheets/d/1sSVMj2ADTL35eiU0-S8bmB9ni8D6aYTWdosbnsR7_24/edit#gid=1389658600
 */

const fs = require('fs');
const Ultron = require('../Ultron');

Ultron.minify({
  files: [
    fs.readFileSync(__dirname + '/nf-e.js', 'utf8'),
    fs.readFileSync(__dirname + '/currencies.js', 'utf8'),
    fs.readFileSync(__dirname + '/costUA-RTG.js', 'utf8'),
    fs.readFileSync(__dirname + '/costMP.js', 'utf8'),
  ],
  output: 'campaignClosing.js',
});
