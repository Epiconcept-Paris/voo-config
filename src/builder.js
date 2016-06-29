export default class Builder {
	constructor(oApplicationConfiguration = {}) {
		this.oApplicationConfiguration = oApplicationConfiguration;
	}

	/**
	 * Return the result of a merge between two objects, the second overwrite properties of the first if they already exists
	 *
	 * @method  mergeObjects
	 * @param   {object}	oSource
	 * @param   {object}	oSecond
	 */
	mergeObjects(oSource = {}, oSecond = {}) {
		const oOutput = {};
		for (const sProperty in oSource) {
			if (Array.isArray(oSource[sProperty])) {
				oOutput[sProperty] = oSource[sProperty];
			} else if (typeof oSource[sProperty] === 'object') {
				oOutput[sProperty] = this.mergeObjects(oOutput[sProperty], oSource[sProperty]);
			} else {
				oOutput[sProperty] = oSource[sProperty];
			}
		}

		for (const sProperty in oSecond) {
			if (Array.isArray(oSecond[sProperty])) {
				oOutput[sProperty] = oSecond[sProperty];
			} else if (typeof oSecond[sProperty] === 'object') {
				oOutput[sProperty] = this.mergeObjects(oOutput[sProperty], oSecond[sProperty]);
			} else {
				oOutput[sProperty] = oSecond[sProperty];
			}
		}
		return oOutput;
	}

	getRawConfigurationByKey(sKey) {
		let oOutput = {};

		Object.keys(this.oApplicationConfiguration)
		// last part of the environmentkey
		.filter(sEnvironmentKey => sEnvironmentKey.split(':').pop() === sKey)
		.forEach(sEnvironmentKey => {
			oOutput = this.mergeObjects(oOutput, this.oApplicationConfiguration[sEnvironmentKey]);
		});

		return oOutput;
	}

	createInheritanceList(sKey) {
		let aList = [];
		Object.keys(this.oApplicationConfiguration)
		.filter(sEnvironmentKey => sEnvironmentKey.split(':').pop() === sKey)
		.forEach(sEnvironmentKey => {
			aList = [
				...aList,
				...sEnvironmentKey.split(':')
			];
		});

		// remove duplicates
		aList = aList.filter((oItem, iIndex, aArray) => aArray.lastIndexOf(oItem) === iIndex);

		aList
		.filter(sSubKey => sSubKey !== sKey)
		.forEach(sSubKey => {
			aList = [
				...this.createInheritanceList(sSubKey),
				...aList
			];
		});

		// remove duplicates
		aList = aList.filter((oItem, iIndex, aArray) => aArray.lastIndexOf(oItem) === iIndex);

		return aList;
	}

	build(sEnvironment) {
		let oOutput = {};
		const aInheritanceList = this.createInheritanceList(sEnvironment);

		aInheritanceList.forEach(sSubEnvironmentKey => {
			oOutput = this.mergeObjects(oOutput, this.getRawConfigurationByKey(sSubEnvironmentKey));
		});

		if (oOutput === undefined) {
			console.log('The configuration is empty, be sure the NODE_ENV is correctly set.');
		}

		return oOutput;
	}
}
