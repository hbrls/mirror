var crypto = require('crypto');
var querystring = require('querystring');
var url = require('url');
var nconf = require('nconf');
var _ = require('lodash');


var METHODS = ['GET', 'POST'];


function _normalize (href) {
  var url_obj = url.parse(href);

  if (url_obj.query) {
    // query segements are sorted asc
    var query_segments = url_obj.query.split('&').sort();
    var search = '?' + query_segments.join('&');
    var normalized_href = url.resolve(url_obj.href.toLowerCase(), search);

    return url.parse(normalized_href);
  } else {
    return url.parse(href.toLowerCase());
  }
}

function _auto_completion (ep) {
  var URL_PREFIX = nconf.get('url_prefix');

  if (ep.href) {
    return _normalize(ep.href);
  }

  var href;
  if (ep.path && ep.path.indexOf('./') === 0) {
    href = URL_PREFIX + ep.path.substring(2);
    return _normalize(href);
  }

  if (ep.pathname && ep.pathname.indexOf('./') === 0 && ep.query) {
    href = URL_PREFIX + ep.pathname.substring(2) + '?' + querystring.stringify(ep.query);
    return _normalize(href);
  }

  throw new Error('invalid endpoint format');
}

function _pathname_seg (ep) {
  return {
    pathname_seg: _.compact(ep.pathname.split('/'))
  };
}

function _method_or_get (ep) {
  if (ep.method && METHODS.indexOf(ep.method.toUpperCase() > -1)) {
    return { method: ep.method.toLowerCase() };
  } else {
    return { method: 'get' };
  }
}

function _hash_id (ep) {
  var md5 = crypto.createHash('md5');
  md5.update(ep.href);
  return { id: md5.digest('hex') };
}


module.exports = function (ep) {
  _.assign(ep, _auto_completion(ep));
  _.assign(ep, _pathname_seg(ep));
  _.assign(ep, _method_or_get(ep));
  _.assign(ep, _hash_id(ep));
  // console.log(ep);

  return ep;
};
