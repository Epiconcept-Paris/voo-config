'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _builder = require('./builder');

var _builder2 = _interopRequireDefault(_builder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var sEnvironment = process.env.NODE_ENV || 'development';
var oBuilder = new _builder2.default();
var oConfig = {};

exports.default = {
	setEnv: function setEnv(sEnv) {
		sEnvironment = sEnv;
		oConfig = oBuilder.build(sEnvironment);
		// create an global object with all the configuration for the app
		global.CONFIG = oConfig;
	},
	fromObject: function fromObject() {
		var oJson = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		if ((typeof oJson === 'undefined' ? 'undefined' : _typeof(oJson)) !== 'object') {
			throw new Error('This is not a valid object.');
		}
		oBuilder = new _builder2.default(oJson);
		oConfig = oBuilder.build(sEnvironment);
		// create an global object with all the configuration for the app
		global.CONFIG = oConfig;
	},
	fromFile: function fromFile(sFilePath) {
		var oContentFile = _fs2.default.readFileSync(sFilePath, 'utf-8');
		oBuilder = new _builder2.default(JSON.parse(oContentFile));
		oConfig = oBuilder.build(sEnvironment);
		// create an global object with all the configuration for the app
		global.CONFIG = oConfig;
	},
	get: function get(sKey, oDefault) {
		var _this = this;

		if (sKey === undefined && oDefault === undefined) {
			// return complete config
			return oConfig;
		}

		if (Array.isArray(sKey)) {
			return sKey.reduce(function (oPrev, sCurrentKey, iIndex) {
				var oSubDefault = void 0;
				if (Array.isArray(oDefault) && oDefault.length > iIndex) {
					oSubDefault = oDefault[iIndex];
				}
				return Object.assign(oPrev, _defineProperty({}, sCurrentKey, _this.get(sCurrentKey, oSubDefault)));
			}, {});
		}

		if (typeof sKey !== 'string') {
			throw new Error('The key passed as argument must be a string or an array of strings.');
		}

		var oValue = sKey.split('.').reduce(function (oPreviousValue, sCurrentKey) {
			return oPreviousValue === undefined ? undefined : oPreviousValue[sCurrentKey];
		}, oConfig);

		return oValue || oDefault;
	}
};