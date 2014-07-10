var path = require('path');
var fs = require('fs');
var nconf = require('nconf');
var q = require('q');
var clc = require('cli-color');


module.exports = function (request, ep) {
  var d = q.defer();

  var OUTPUT = nconf.get('output_json_dir');
  var json = path.resolve(OUTPUT, ep.id + '.json');

  var FORCE_RE_GENERATE = nconf.get('f') === true;

  if (fs.existsSync(json) && !FORCE_RE_GENERATE) {
    console.log(clc.blue('EXISTS:'), clc.blue(ep.href), clc.blue(ep.id));
    d.resolve();
  } else {
    console.log('LOADING:', ep.href, ep.id);

    var res = request[ep.method](ep.href);

    // res.on('data', function (d) {
    //   console.log('  loading...' + d);
    // });

    res.on('end', function () {
      console.log('SUCCESS:', ep.href, ep.id);
      d.resolve();
    });

    res.on('error', function () {
      console.log('ERROR: ', ep.href, ep.id, e.message);
      d.reject();
    });

    // res.on('response', function (resp) {
    //   console.log(resp.headers, resp.statusCode);
    // });

    var write_stream = fs.createWriteStream(json);
    res.pipe(write_stream);
  }

  return d.promise;
};