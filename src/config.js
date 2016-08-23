export default class ConfigStorage {
	constructor(oBuilder) {
		this.sEnvironment = process.env.NODE_ENV || 'development';
		this.oBuilder = oBuilder;
		this.oStorageConfig = this.oBuilder.build(this.sEnvironment);
	}

	setEnv(sEnv) {
		this.sEnvironment = sEnv;
		this.oStorageConfig = this.oBuilder.build(this.sEnvironment);
	}

	get(sKey, oDefault) {
		if (sKey === undefined && oDefault === undefined) {
			// return complete config
			return this.oStorageConfig;
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
			this.oStorageConfig
		);

		return oValue || oDefault;
	}
}
