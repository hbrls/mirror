var path = require('path');
var nconf = require('nconf');
var request = require('request');
var _ = require('lodash');
var q = require('q');

var endpoint_format = require('./scripts/endpoint_format');


nconf
  .env()
  .argv({ 'name': { demand: true } })
  .file('settings', './settings.json');


var ENDPOINTS = require('./endpoints.json');

var endpoints = _.map(ENDPOINTS, function (ep) {
  return endpoint_format(ep);
});


var name = nconf.get('name').toLowerCase();

var result = _.filter(endpoints, function (ep) {
  return ep.href.indexOf(name) > -1;
});

if (result.length > 0) {
  _.each(result, function (r) {
    console.log(r.href);
    console.log(r.id);
    console.log('---');
  });
} else {
  console.log('NOT FOUND!');
}
