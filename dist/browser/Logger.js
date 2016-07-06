'use strict';

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

/* eslint no-console:0 */
var LoggerBase = require('../lib/base/LoggerBase');

/**
 * Creates browser logger.
 *
 * @param {ServiceLocator} $serviceLocator
 * @constructor
 */

var Logger = function (_LoggerBase) {
  (0, _inherits3.default)(Logger, _LoggerBase);

  function Logger(locator) {
    (0, _classCallCheck3.default)(this, Logger);


    /**
     * Browser logger transports.
     *
     * @type {Array}
     * @private
     */

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Logger).call(this));

    _this._transports = [];

    /**
     * Catbee logger config reference
     *
     * @type {Object}
     * @private
     */
    _this._config = locator.resolve('config');
    _this._config.logger = _this._config.logger || {};

    _this.addEnrichment(function (log) {
      log.from = 'Browser';
    });

    _this.addTransport(Logger._consoleTransport);

    _this._setLevels(_this._config.logger.levels);

    _this.debug = _this.debug.bind(_this);
    _this.trace = _this.trace.bind(_this);
    _this.info = _this.info.bind(_this);
    _this.warn = _this.warn.bind(_this);
    _this.error = _this.error.bind(_this);
    _this.fatal = _this.fatal.bind(_this);
    _this.onerror = _this.onerror.bind(_this);
    return _this;
  }

  /**
   * Add log messages transport.
   *
   * @param {function} transport
   */


  (0, _createClass3.default)(Logger, [{
    key: 'addTransport',
    value: function addTransport(transport) {
      if (typeof transport !== 'function') {
        throw new TypeError('Transport must be a function');
      }

      this._transports.push(transport);
    }

    /**
     * Add log messages transport.
     *
     * @param {function} transport
     */

  }, {
    key: 'removeTransport',
    value: function removeTransport(transport) {
      var index = this._transports.indexOf(transport);

      if (index === -1) {
        this.info('Transport not found. Remove nothing');
        return;
      }

      this._transports.splice(index, 1);
    }
  }, {
    key: 'dropTransports',
    value: function dropTransports() {
      this._transports = [];
    }

    /**
     * Window error event handler.
     *
     * @param {ErrorEvent} error
     * @param {String} message
     * @param {Number} lineno - line number
     * @param {Number} colno - column number
     * @param {String} filename - script
     */

  }, {
    key: 'onerror',
    value: function onerror(_ref) {
      var message = _ref.message;
      var filename = _ref.filename;
      var lineno = _ref.lineno;
      var colno = _ref.colno;
      var error = _ref.error;

      this._send('error', message, {
        stack: error.stack,
        filename: filename,
        line: lineno + ':' + colno
      });
    }

    /**
     * Logs trace message.
     *
     * @param {string} message Error object or message.
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
     * Logs trace message.
     * @param {string} message Error object or message.
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
     * Logs info message.
     *
     * @param {string|Object|Error} message Error object or message.
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
     * @param {string} message Error object or message.
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
     * @param {string|Error} message Error object or message.
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
     * Logs error message.
     * @param {string|Error} message Error object or message.
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

    /**
     * Transport to browser console.
     *
     * @param {string} level
     * @param {Object} log
     */

  }, {
    key: 'log',


    /**
     * Entry point for browser logs.
     * Executes from LoggerBase.
     *
     * @param {string} level
     * @param {Object} log
     */
    value: function log(level, _log) {
      this._transports.forEach(function (transport) {
        return transport(level, _log);
      });
    }
  }], [{
    key: '_consoleTransport',
    value: function _consoleTransport(level, log) {
      var map = {
        trace: 'log',
        debug: 'log',
        info: 'info',
        warn: 'warn',
        error: 'error',
        fatal: 'error'
      };

      if (console[map[level]]) {
        console[map[level]]('[' + level.toUpperCase() + ']', log.stack || log.message);
      }
    }
  }]);
  return Logger;
}(LoggerBase);

module.exports = Logger;