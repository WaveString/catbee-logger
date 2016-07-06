'use strict';

var Logger = require('./lib/Logger');

module.exports = {
  /**
   * @param {ServiceLocator} locator
   * @param {Function} locator.register
   */

  register: function register(locator, formatter) {
    var config = locator.resolve('config');
    var logger = new Logger(locator, formatter);

    locator.registerInstance('logger', logger);

    var bus = locator.resolve('eventBus');

    bus.on('error', function (error) {
      return logger.error(error);
    });
  }
};