var crypto = require('crypto');
var querystring = require('querystring');
var url = require('url');
var nconf = require('nconf');
var _ = require('lodash');


var METHODS = ['GET', 'POST'];


function _auto_completion (ep) {
  var URL_PREFIX = nconf.get('url_prefix');
  var _ep = _.clone(ep);

  if (_ep.href) {
    return url.parse(_ep.href);
  }

  if (_ep.path && _ep.path.indexOf('./') === 0) {
    _ep.href = URL_PREFIX + _ep.path.substring(2);
    return url.parse(_ep.href);
  }

  if (_ep.pathname && _ep.pathname.indexOf('./') === 0 && _ep.query) {
    _ep.href = URL_PREFIX + _ep.pathname.substring(2) + '?' + querystring.stringify(_ep.query);
    return url.parse(_ep.href);
  }

  throw new Error('invalid endpoint format');
}

function _pathname_seg (ep) {
  return {
    pathname_seg: _.compact(ep.pathname.toLowerCase().split('/'))
  };
}

function _method_or_get (ep) {
  if (ep.method && METHODS.indexOf(ep.method.toUpperCase() > -1)) {
    return { method: ep.method.toLowerCase() };
  } else {
    return { method: 'get' };
  }
}

function _hash (content) {
  var md5 = crypto.createHash('md5');
  md5.update(content);
  return md5.digest('hex');
}


module.exports = function (ep) {
  _.assign(ep, _auto_completion(ep));
  _.assign(ep, _pathname_seg(ep));
  _.assign(ep, _method_or_get(ep));

  ep.href_hash = _hash(ep.href);

  return ep;
};
