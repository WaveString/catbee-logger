'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var winston = require('winston');
var LoggerBase = require('./base/LoggerBase');

/**
 * Creates server logger.
 *
 * @param {ServiceLocator} $serviceLocator
 * @class
 */

var Logger = function (_LoggerBase) {
  (0, _inherits3.default)(Logger, _LoggerBase);

  function Logger(locator, formatter) {
    (0, _classCallCheck3.default)(this, Logger);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Logger).call(this));

    _this._config = locator.resolve('config');
    _this._formatter = formatter;
    _this._config.logger = _this._config.logger || {};

    _this._setLevels(_this._config.logger.levels);

    _this.addEnrichment(function (log) {
      log.from = 'Server';
    });

    _this._logger = new winston.Logger({
      level: 'trace',
      levels: { fatal: 0, error: 1, warn: 2, info: 3, debug: 4, trace: 5 }
    });

    /**
     * Native winston interface for add/remove transports.
     */
    _this.addTransport = _this._logger.add.bind(_this._logger);
    _this.removeTransport = _this._logger.remove.bind(_this._logger);

    /**
     * Entry point for server logs.
     * Executes from LoggerBase.
     */
    _this.log = _this._logger.log.bind(_this._logger);

    _this._initConsoleLogger(_this._config.logger.console);
    return _this;
  }

  (0, _createClass3.default)(Logger, [{
    key: 'dropTransports',
    value: function dropTransports() {
      var _this2 = this;

      (0, _keys2.default)(this._logger.transports).forEach(function (transport) {
        return _this2.removeTransport(transport);
      });
    }

    /**
     * Init console transport logger
     *
     * @param {Object} userConfig
     * @private
     */

  }, {
    key: '_initConsoleLogger',
    value: function _initConsoleLogger() {
      var userConfig = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var config = userConfig;

      var formatter = this._formatter;

      if (formatter) {
        config = formatter.config(userConfig, {
          colors: {
            trace: 'blue',
            debug: 'cyan',
            info: 'green',
            warn: 'yellow',
            error: 'red',
            fatal: 'magenta'
          }
        });
      }

      this.addTransport(winston.transports.Console, config);
    }

    /**
     * Logs debug message.
     *
     * @param {string} message
     * @param {Object|undefined} meta
     */

  }, {
    key: 'debug',
    value: function debug(message) {
      var meta = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (!this._levels.debug) {
        return;
      }

      this._message('debug', message, meta);
    }

    /**
     * Logs trace message.
     *
     * @param {string} message
     * @param {Object|undefined} meta
     */

  }, {
    key: 'trace',
    value: function trace(message) {
      var meta = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (!this._levels.trace) {
        return;
      }

      this._message('trace', message, meta);
    }

    /**
     * Logs info message.
     *
     * @param {string} message
     * @param {Object|undefined} meta
     */

  }, {
    key: 'info',
    value: function info(message) {
      var meta = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (!this._levels.info) {
        return;
      }

      this._message('info', message, meta);
    }

    /**
     * Logs warn message.
     *
     * @param {string} message
     * @param {Object|undefined} meta
     */

  }, {
    key: 'warn',
    value: function warn(message) {
      var meta = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (!this._levels.warn) {
        return;
      }

      this._message('warn', message, meta);
    }

    /**
     * Logs error message.
     *
     * @param {string|Error} message
     * @param {Object|undefined} meta
     */

  }, {
    key: 'error',
    value: function error(message) {
      var meta = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (!this._levels.error) {
        return;
      }

      this._error('error', message, meta);
    }

    /**
     * Logs fatal message.
     *
     * @param {string|Error} message
     * @param {Object|undefined} meta
     */

  }, {
    key: 'fatal',
    value: function fatal(message) {
      var meta = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (!this._levels.fatal) {
        return;
      }

      this._error('fatal', message, meta);
    }
  }]);
  return Logger;
}(LoggerBase);

module.exports = Logger;