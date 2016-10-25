var fs = require('fs');
var path = require('path');
var eol = require('os').EOL;
var mkdir = require('mkdirp');
var request = require('request');
var log = require('npmlog');
var pkg = require('../package.json');


var USER_AGENT = `node/${process.version} sentry-cli/${pkg.version}`;
var JAR_NAME = 'wiremock-standalone';
var JAR_VERSION = '2.2.1';
var JAR = `${JAR_NAME}-${JAR_VERSION}.jar`;
var JAR_URL = `http://repo1.maven.org/maven2/com/github/tomakehurst/${JAR_NAME}/${JAR_VERSION}/${JAR}`;


/**
 * Download file, if succeeds save, if not delete
 *
 * @param {String} url
 * @param {String} dest
 * @param {Function} cb
 * @api private
 */

function download(url, dest, cb) {
  var reportError = function(err) {
    var timeoutMessge;

    if (err.code === 'ETIMEDOUT') {
      if (err.connect === true) {
        // timeout is hit while your client is attempting to establish a connection to a remote machine
        timeoutMessge = 'Timed out attemping to establish a remote connection';
      } else {
        timeoutMessge = 'Timed out whilst downloading the prebuilt binary';
        // occurs any time the server is too slow to send back a part of the response
      }

    }
    cb(['Cannot download "', url, '": ', eol, eol,
      typeof err.message === 'string' ? err.message : err, eol, eol,
      timeoutMessge ? timeoutMessge + eol + eol : timeoutMessge,
      'Hint: GFW', eol].join(''));
  };

  var successful = function(response) {
    return response.statusCode >= 200 && response.statusCode < 300;
  };

  var options = {
    rejectUnauthorized: false,
    timeout: 60000,
    headers: {
      'User-Agent': USER_AGENT,
    }
  };

  console.log('Start downloading jar at', url);

  try {
    request(url, options, function(err, response) {
      if (err) {
        reportError(err);
      } else if (!successful(response)) {
        reportError(['HTTP error', response.statusCode, response.statusMessage].join(' '));
      } else {
        cb();
      }
    })
    .on('response', function(response) {
      var length = parseInt(response.headers['content-length'], 10);
      var progress = log.newItem(url, length);

      if (successful(response)) {
        response.pipe(fs.createWriteStream(dest));
      }

      // The `progress` is true by default. However if it has not
      // been explicitly set it's `undefined` which is considered
      // as far as npm is concerned.
      if (process.env.npm_config_progress !== false) {
        log.enableProgress();

        response.on('data', function(chunk) {
          progress.completeWork(chunk.length);
        })
        .on('end', progress.finish);
      }
    });
  } catch (err) {
    cb(err);
  }
}

/**
 * Check and download binary
 *
 * @api private
 */

function checkAndDownloadJar() {
  var vendorDir = path.resolve(__dirname, '..', 'vendor');
  var jarPath = path.join(vendorDir, JAR);

  if (fs.existsSync(jarPath)) {
    console.log('    Found downloaded jar in ' + vendorDir);
    console.log();
    return;
  }

  mkdir(vendorDir, function(err) {
    if (err) {
      console.error(err);
      return;
    }

    var cachePath = path.join(process.env.npm_config_cache, pkg.name, pkg.version);
    var cacheJar = path.join(cachePath, JAR);
    if (fs.existsSync(cacheJar)) {
      console.log('    Found cached jar in ' + cacheJar);
      fs.createReadStream(cacheJar).pipe(fs.createWriteStream(jarPath));
      console.log();
    } else {
      // In case the cache path doesn't exist
      mkdir(cachePath, function(err) {
        if (err) {
          console.error(err);
          return;
        }

        download(JAR_URL, cacheJar, function(err) {
          if (err) {
            console.error(err);
            return;
          }

          console.log('Jar downloaded to ' + cacheJar);
          fs.createReadStream(cacheJar).pipe(fs.createWriteStream(jarPath));
        });
      });
    }
  });
}

/**
 * If jar does not exist, download it
 */

checkAndDownloadJar();
