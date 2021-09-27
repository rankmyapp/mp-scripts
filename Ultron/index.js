const fs = require('fs');
const uglify = require('uglify-js');

const result = uglify.minify(
  [
    fs.readFileSync(__dirname + '/ultron.js', 'utf8'),
    fs.readFileSync(__dirname + '/ultron.utils.js', 'utf8'),
    fs.readFileSync(__dirname + '/jarvis-api.js', 'utf8'),
    fs.readFileSync(__dirname + '/media-event-provider-api.js', 'utf8'),
  ],

  {
    keep_fnames: true,
    compress: false,
  }
);

fs.writeFile('cdn.js', result.code, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Success');
  }
});
