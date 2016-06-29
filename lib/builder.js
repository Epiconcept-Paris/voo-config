'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Builder = function () {
	function Builder() {
		var oApplicationConfiguration = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, Builder);

		this.oApplicationConfiguration = oApplicationConfiguration;
	}

	/**
  * Return the result of a merge between two objects, the second overwrite properties of the first if they already exists
  *
  * @method  mergeObjects
  * @param   {object}	oSource
  * @param   {object}	oSecond
  */


	_createClass(Builder, [{
		key: 'mergeObjects',
		value: function mergeObjects() {
			var oSource = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
			var oSecond = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

			var oOutput = {};
			for (var sProperty in oSource) {
				if (Array.isArray(oSource[sProperty])) {
					oOutput[sProperty] = oSource[sProperty];
				} else if (_typeof(oSource[sProperty]) === 'object') {
					oOutput[sProperty] = this.mergeObjects(oOutput[sProperty], oSource[sProperty]);
				} else {
					oOutput[sProperty] = oSource[sProperty];
				}
			}

			for (var _sProperty in oSecond) {
				if (Array.isArray(oSecond[_sProperty])) {
					oOutput[_sProperty] = oSecond[_sProperty];
				} else if (_typeof(oSecond[_sProperty]) === 'object') {
					oOutput[_sProperty] = this.mergeObjects(oOutput[_sProperty], oSecond[_sProperty]);
				} else {
					oOutput[_sProperty] = oSecond[_sProperty];
				}
			}
			return oOutput;
		}
	}, {
		key: 'getRawConfigurationByKey',
		value: function getRawConfigurationByKey(sKey) {
			var _this = this;

			var oOutput = {};

			Object.keys(this.oApplicationConfiguration)
			// last part of the environmentkey
			.filter(function (sEnvironmentKey) {
				return sEnvironmentKey.split(':').pop() === sKey;
			}).forEach(function (sEnvironmentKey) {
				oOutput = _this.mergeObjects(oOutput, _this.oApplicationConfiguration[sEnvironmentKey]);
			});

			return oOutput;
		}
	}, {
		key: 'createInheritanceList',
		value: function createInheritanceList(sKey) {
			var _this2 = this;

			var aList = [];
			Object.keys(this.oApplicationConfiguration).filter(function (sEnvironmentKey) {
				return sEnvironmentKey.split(':').pop() === sKey;
			}).forEach(function (sEnvironmentKey) {
				aList = [].concat(_toConsumableArray(aList), _toConsumableArray(sEnvironmentKey.split(':')));
			});

			// remove duplicates
			aList = aList.filter(function (oItem, iIndex, aArray) {
				return aArray.lastIndexOf(oItem) === iIndex;
			});

			aList.filter(function (sSubKey) {
				return sSubKey !== sKey;
			}).forEach(function (sSubKey) {
				aList = [].concat(_toConsumableArray(_this2.createInheritanceList(sSubKey)), _toConsumableArray(aList));
			});

			// remove duplicates
			aList = aList.filter(function (oItem, iIndex, aArray) {
				return aArray.lastIndexOf(oItem) === iIndex;
			});

			return aList;
		}
	}, {
		key: 'build',
		value: function build(sEnvironment) {
			var _this3 = this;

			var oOutput = {};
			var aInheritanceList = this.createInheritanceList(sEnvironment);

			aInheritanceList.forEach(function (sSubEnvironmentKey) {
				oOutput = _this3.mergeObjects(oOutput, _this3.getRawConfigurationByKey(sSubEnvironmentKey));
			});

			if (oOutput === undefined) {
				console.log('The configuration is empty, be sure the NODE_ENV is correctly set.');
			}

			return oOutput;
		}
	}]);

	return Builder;
}();

exports.default = Builder;