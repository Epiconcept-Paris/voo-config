import Builder from './builder';
import Config from './config';

export default {
	fromObject(oJson = {}) {
		if (typeof oJson !== 'object') {
			throw new Error('This is not a valid object.');
		}
		return new Config(new Builder(oJson));
	},

	fromFile(oFileSystemPackage, sFilePath) {
		if (typeof oFileSystemPackage !== 'object' || oFileSystemPackage.readFileSync === undefined) {
			throw new Error('FileSystem package has not been provided as first argument.');
		}

		const oContentFile = oFileSystemPackage.readFileSync(sFilePath, 'utf-8');
		return new Config(new Builder(JSON.parse(oContentFile)));
	}
};
