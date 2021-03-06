/**
 * Dependencies
 */

const debug = require('debug');
const atomVersion = require('./version');
const getHead = require('./head');

/**
 * Dependencies
 */

const log = debug('last-release-apm');

/**
 * Interface
 */

module.exports = function lastRelease(pluginConfig, { pkg, options }, callback) {
  log(options);

  atomVersion(pkg, (err1, version = null) => {
    log({ version, err1 });
    if (err1) return callback(err1);
    if (!version) return callback(null, {});

    return getHead(options, pkg, version, (err2, gitHead = null) => {
      log({ gitHead, err2 });
      if (err2) return callback(err2);

      return callback(null, { gitHead, version });
    });
  });
};
