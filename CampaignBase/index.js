/**
 * Planilha que utiliza esse Script:
 * https://docs.google.com/spreadsheets/d/1D_y34ywSoI8rJELb7T4hjH-ZFSYFB6c66tANuH9FUUc/edit#gid=101820467
 */

const fs = require('fs');
const Ultron = require('../Ultron');

Ultron.minify({
  files: [
    fs.readFileSync(__dirname + '/jarvis-api.js', 'utf8'),
    fs.readFileSync(__dirname + '/media-event-provider-api.js', 'utf8'),
  ],
  output: 'cdn.js',
});
