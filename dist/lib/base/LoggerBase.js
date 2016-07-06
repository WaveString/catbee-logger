'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Basic functionality for loggers
 *
 * @abstract
 * @class
 * */

var LoggerBase = function () {
  function LoggerBase() {
    (0, _classCallCheck3.default)(this, LoggerBase);

    /**
     * Current levels of logging.
     *
     * @type {Object}
     * @protected
     */
    this._levels = {
      debug: true,
      trace: true,
      info: true,
      warn: true,
      error: true,
      fatal: true
    };

    /**
     * List of log message enrichments
     *
     * @type {Array<function>}
     * @private
     */
    this._enrichments = [];
  }

  /**
   * Set levels of logging from config.
   *
   * @param {string|Object|undefined} levels
   * @protected
   */


  (0, _createClass3.default)(LoggerBase, [{
    key: '_setLevels',
    value: function _setLevels(levels) {
      var _this = this;

      if ((typeof levels === 'undefined' ? 'undefined' : (0, _typeof3.default)(levels)) === 'object') {
        this._levels = levels;
      }

      if (typeof levels === 'string') {
        this._levels = {};

        levels.toLowerCase().split(',').forEach(function (level) {
          _this._levels[level] = true;
        });
      }
    }

    /**
     * Format error to send by network.
     *
     * @param {string|Object|Error} error
     * @returns {{message: string, fields: Object}}
     * @protected
     */

  }, {
    key: '_errorFormatter',
    value: function _errorFormatter(error) {
      var fields = {};
      var message = void 0;

      if (error instanceof Error) {
        fields.stack = error.stack;
        message = error.name + ': ' + error.message;
      } else if ((typeof error === 'undefined' ? 'undefined' : (0, _typeof3.default)(error)) === 'object') {
        message = error.message;
        delete error.message;
        fields = error;
        fields.stack = error.stack || new Error(error).stack;
      } else if (typeof error === 'string') {
        fields.stack = new Error(error).stack;
        message = error;
      }

      return { message: message, fields: fields };
    }

    /**
     * Add log message enrichment.
     * Enrichments is a function which executed with log object for enrich him.
     *
     * @example: function enrichment (logObject) {
     *   logObject.session = cookie.session_token
     * }
     *
     * @param {function} enrichment
     */

  }, {
    key: 'addEnrichment',
    value: function addEnrichment(enrichment) {
      if (typeof enrichment !== 'function') {
        throw new TypeError('Enrichment must be a function');
      }

      this._enrichments.push(enrichment);
    }

    /**
     * Remove single enrichment.
     *
     * @param {function} enrichment
     */

  }, {
    key: 'removeEnrichment',
    value: function removeEnrichment(enrichment) {
      var index = this._enrichments.indexOf(enrichment);

      if (index === -1) {
        this.log('info', 'Enrichment not found. Remove nothing');
        return;
      }

      this._enrichments.splice(index, 1);
    }

    /**
     * Drop all current log message enrichments.
     */

  }, {
    key: 'dropEnrichments',
    value: function dropEnrichments() {
      this._enrichments = [];
    }

    /**
     * Apply all enrichments to log object.
     *
     * @param {Object} log
     * @param {string} level
     * @protected
     */

  }, {
    key: '_enrichLog',
    value: function _enrichLog(log, level) {
      this._enrichments.forEach(function (enrich) {
        return enrich(log, level);
      });
    }

    /**
     * Logs with stack trace.
     *
     * @param {string} level
     * @param {Error|string} error
     * @param {Object|undefined} data
     * @protected
     */

  }, {
    key: '_error',
    value: function _error(level, error) {
      var data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var _errorFormatter2 = this._errorFormatter(error);

      var message = _errorFormatter2.message;
      var fields = _errorFormatter2.fields;

      var meta = (0, _assign2.default)({}, fields, data);

      this._send(level, message, meta);
    }

    /**
     * Logs without stack trace.
     *
     * @param {string} level
     * @param {string} message
     * @param {Object|undefined} data
     * @protected
     */

  }, {
    key: '_message',
    value: function _message(level, message) {
      var data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      this._send(level, message, data);
    }

    /**
     * Enrich log message and send to log(level, log) method which must be realized by
     * inheritor.
     *
     * @param {string} level
     * @param {string} message
     * @param {Object} meta
     * @protected
     */

  }, {
    key: '_send',
    value: function _send(level, message) {
      var meta = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var log = (0, _assign2.default)({}, { message: message }, meta);

      this._enrichLog(log, level);

      this.log(level, log);
    }
  }, {
    key: 'log',
    value: function log() {
      throw new ReferenceError('Logger must realize log(level: string, log: Object) method');
    }
  }]);
  return LoggerBase;
}();

module.exports = LoggerBase;