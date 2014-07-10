var fs = require('fs');
var path = require('path');
var nconf = require('nconf');
var request = require('request');
var _ = require('lodash');
var q = require('q');

var endpoint_format = require('./scripts/endpoint_format');
var save_json = require('./scripts/save_json');
var save_code = require('./scripts/save_code');


nconf
  .env()
  .argv()
  .file('settings', './settings.json');

nconf.set('output_json_dir', path.resolve(__dirname, nconf.get('output_json_dir')));
nconf.set('output_code_dir', path.resolve(__dirname, nconf.get('output_code_dir')));


var ENDPOINTS = require('./endpoints.json');


var endpoints = _.map(ENDPOINTS, function (ep) {
  return endpoint_format(ep);
});

// TODO: check duplicate

function main() {
  var d = q.defer();

  var _request = request;

  var login = nconf.get('login');
  if (login) {
    // var method = login.method;

    _request = request.defaults({ jar: true });
    var login_form = {
      username: login.username,
      password: login.password,
    };

    _request.post(login.href, { form: login_form }, function (err, res, body) {
      console.log('======== LOGIN SUCCESS! ========');

      d.resolve(_request);
    });
  } else {
    d.resolve(_request);
  }

  return d.promise;
}


main()
  .then(function (_request) {
    var fetch_quene = _.map(ENDPOINTS, function (ep) {
      return save_json(_request, ep);
    });

    return q.all(fetch_quene);
  })
  .then(function () {
    save_code(endpoints);

    console.log('======== DONE, ENJOY! ========');
  })
  .fail(function (error) {
    console.log(error);
  })
  .done();
