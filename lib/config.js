'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConfigStorage = function () {
	function ConfigStorage(oBuilder) {
		_classCallCheck(this, ConfigStorage);

		this.sEnvironment = process.env.NODE_ENV || 'development';
		this.oBuilder = oBuilder;
		this.oStorageConfig = this.oBuilder.build(this.sEnvironment);
	}

	_createClass(ConfigStorage, [{
		key: 'setEnv',
		value: function setEnv(sEnv) {
			this.sEnvironment = sEnv;
			this.oStorageConfig = this.oBuilder.build(this.sEnvironment);
		}
	}, {
		key: 'get',
		value: function get(sKey, oDefault) {
			var _this = this;

			if (sKey === undefined && oDefault === undefined) {
				// return complete config
				return this.oStorageConfig;
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
			}, this.oStorageConfig);

			return oValue || oDefault;
		}
	}]);

	return ConfigStorage;
}();

exports.default = ConfigStorage;