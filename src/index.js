import Builder from './builder';

let sEnvironment = process.env.NODE_ENV || 'development';
let oBuilder = new Builder();
let oConfig = {};

export default {
	setEnv(sEnv) {
		sEnvironment = sEnv;
		oConfig = oBuilder.build(sEnvironment);
		// create an global object with all the configuration for the app
		global.CONFIG = oConfig;
	},
	fromObject(oJson = {}) {
		if (typeof oJson !== 'object') {
			throw new Error('This is not a valid object.');
		}
		oBuilder = new Builder(oJson);
		oConfig = oBuilder.build(sEnvironment);
		// create an global object with all the configuration for the app
		global.CONFIG = oConfig;
	},
	fromFile(oFileSystemPackage, sFilePath) {
		if (typeof oFileSystemPackage !== 'object' || oFileSystemPackage.readFileSync === undefined) {
			throw new Error('FileSystem package has not been provided as first argument.');
		}

		const oContentFile = oFileSystemPackage.readFileSync(sFilePath, 'utf-8');
		oBuilder = new Builder(JSON.parse(oContentFile));
		oConfig = oBuilder.build(sEnvironment);
		// create an global object with all the configuration for the app
		global.CONFIG = oConfig;
	},
	get(sKey, oDefault) {
		if (sKey === undefined && oDefault === undefined) {
			// return complete config
			return oConfig;
		}

		if (Array.isArray(sKey)) {
			return sKey
			.reduce(
				(oPrev, sCurrentKey, iIndex) => {
					let oSubDefault;
					if (Array.isArray(oDefault) && oDefault.length > iIndex) {
						oSubDefault = oDefault[iIndex];
					}
					return Object.assign(
						oPrev,
						{
							[sCurrentKey]: this.get(sCurrentKey, oSubDefault)
						}
					);
				},
				{}
			);
		}

		if (typeof sKey !== 'string') {
			throw new Error('The key passed as argument must be a string or an array of strings.');
		}

		const oValue = sKey
		.split('.')
		.reduce(
			(oPreviousValue, sCurrentKey) => (oPreviousValue === undefined) ? undefined : oPreviousValue[sCurrentKey],
			oConfig
		);

		return oValue || oDefault;
	},
	reset() {
		oBuilder = new Builder();
		oConfig = {};
		global.CONFIG = oConfig;
	}
};
