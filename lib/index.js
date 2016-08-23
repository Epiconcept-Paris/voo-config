'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _builder = require('./builder');

var _builder2 = _interopRequireDefault(_builder);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	fromObject: function fromObject() {
		var oJson = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		if ((typeof oJson === 'undefined' ? 'undefined' : _typeof(oJson)) !== 'object') {
			throw new Error('This is not a valid object.');
		}
		return new _config2.default(new _builder2.default(oJson));
	},
	fromFile: function fromFile(oFileSystemPackage, sFilePath) {
		if ((typeof oFileSystemPackage === 'undefined' ? 'undefined' : _typeof(oFileSystemPackage)) !== 'object' || oFileSystemPackage.readFileSync === undefined) {
			throw new Error('FileSystem package has not been provided as first argument.');
		}

		var oContentFile = oFileSystemPackage.readFileSync(sFilePath, 'utf-8');
		return new _config2.default(new _builder2.default(JSON.parse(oContentFile)));
	}
};