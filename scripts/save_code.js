var path = require('path');
var fs = require('fs');
var nconf = require('nconf');
var dust = require('dustjs-linkedin');


var TEMPLATE_DIR = path.resolve(__dirname, '../templates');
var TEMPLATE_KEY = 'code_template';


module.exports = function (endpoints) {
  var code_template = nconf.get('code_template');
  var tpl = path.resolve(TEMPLATE_DIR, code_template);
  // FIXME: remove .dust
  var code_file = path.resolve(nconf.get('output_code_dir'), code_template.substring(0, code_template.length - 5));

  fs.readFile(tpl, 'utf-8', function (err, data) {
    if (err) {
      console.log(err);
    }

    dust.loadSource(dust.compile(data, TEMPLATE_KEY));

    dust.render(TEMPLATE_KEY, { endpoints: endpoints }, function (err, out) {
      if (err) {
        console.log(err);
      }

      fs.writeFile(code_file, out, function (err) {
        if (err) {
          console.log(err);
        }
      });
    });

  });
};
