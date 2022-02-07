const fs = require('fs');
const path = require('path');
const uglify = require('uglify-js');

const minify = ({ output, files }) => {
  if (!Array.isArray(files) || typeof output !== 'string') return;

  const result = uglify.minify(
    [
      fs.readFileSync(__dirname + '/ultron.js', 'utf8'),
      fs.readFileSync(__dirname + '/ultron.utils.js', 'utf8'),
      ...files,
    ],
    {
      keep_fnames: true,
      compress: false,
    }
  );

  fs.writeFile(
    `${path.dirname(__dirname)}/${output}`,
    result.code.replace('@ULTRON_VERSION', process.env.npm_package_version),
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`${output} - Success`);
      }
    }
  );
};

module.exports = {
  minify,
};
