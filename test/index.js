import {describe, it} from 'mocha';
import {expect} from 'chai';
import path from 'path';
import fs from 'fs';
import Config from '../lib';

describe('voo-config', () => {
	it('should load from object', done => {
		const oConfig = Config.fromObject({
			development: {
				name: 'root'
			}
		});
		oConfig.setEnv('development');
		const sName = oConfig.get('name');
		expect(sName).to.be.equal('root');

		done();
	});

	it('should throw error if try to load from file with missing FileSystem package', done => {
		const sError = 'FileSystem package has not been provided as first argument.';

		const sFilePath = path.join(__dirname, 'application.json');
		expect(() => Config.fromFile(sFilePath)).to.throw(sError);
		expect(() => Config.fromFile(sFilePath, fs)).to.throw(sError);
		expect(() => Config.fromFile({}, sFilePath)).to.throw(sError);
		expect(() => Config.fromFile(undefined, sFilePath)).to.throw(sError);

		done();
	});

	it('should load from file and should be possible to get parameter', done => {
		const sFilePath = path.join(__dirname, 'application.json');
		const oConfig = Config.fromFile(fs, sFilePath);

		oConfig.setEnv('development');
		const iPort = oConfig.get('port');
		expect(iPort).to.be.equal(8080);

		done();
	});

	it('should be possible to change environment', done => {
		const sFilePath = path.join(__dirname, 'application.json');
		const oConfig = Config.fromFile(fs, sFilePath);

		oConfig.setEnv('development');
		const iPortDev = oConfig.get('port');
		expect(iPortDev).to.be.equal(8080);

		oConfig.setEnv('production');
		const iPortProd = oConfig.get('port');
		expect(iPortProd).to.be.equal(8002);

		done();
	});

	it('should be possible to retrieve a parameter inherit from an env, an other overwrite by another env', done => {
		const sFilePath = path.join(__dirname, 'application.json');
		const oConfig = Config.fromFile(fs, sFilePath);

		oConfig.setEnv('production');
		const sName = oConfig.get('name');
		const sHost = oConfig.get('host');
		expect(sName).to.be.equal('production');
		expect(sHost).to.be.equal('localhost');

		done();
	});

	it('should be possible to retrieve an array', done => {
		const sFilePath = path.join(__dirname, 'application.json');
		const oConfig = Config.fromFile(fs, sFilePath);

		oConfig.setEnv('production');
		const aList = oConfig.get('list');
		expect(aList).to.be.a('array');
		expect(aList).to.have.length(3);

		const aModel = ['first', 'second', 'third'];
		for (let i = 0; i < aList.length; i++) {
			expect(aList[i]).to.be.equal(aModel[i]);
		}

		done();
	});

	it('should be possible to retrieve an overwrited array', done => {
		const sFilePath = path.join(__dirname, 'application.json');
		const oConfig = Config.fromFile(fs, sFilePath);

		oConfig.setEnv('development');
		const aList = oConfig.get('list2');
		expect(aList).to.be.a('array');
		expect(aList).to.have.length(3);

		const aModel = ['first', 'second', 'third'];
		for (let i = 0; i < aList.length; i++) {
			expect(aList[i]).to.be.equal(aModel[i]);
		}

		done();
	});

	it('should be possible to retrieve an object', done => {
		const sFilePath = path.join(__dirname, 'application.json');
		const oConfig = Config.fromFile(fs, sFilePath);

		oConfig.setEnv('production');
		const oProperty = oConfig.get('property');
		expect(oProperty).to.be.a('object');
		expect(oProperty.subproperty).to.be.equal('value_sub');
		expect(oProperty.subproperty2).to.be.equal('value_sub2');

		done();
	});

	it('should be possible to retrieve an object with an overwrited subproperty', done => {
		const sFilePath = path.join(__dirname, 'application.json');
		const oConfig = Config.fromFile(fs, sFilePath);

		oConfig.setEnv('development');
		const oProperty = oConfig.get('property');
		expect(oProperty).to.be.a('object');
		expect(oProperty.subproperty).to.be.equal('overwrited_value_sub');
		expect(oProperty.subproperty2).to.be.equal('value_sub2');

		done();
	});

	it('should be possible to retrieve directly a property from an object', done => {
		const sFilePath = path.join(__dirname, 'application.json');
		const oConfig = Config.fromFile(fs, sFilePath);

		oConfig.setEnv('development');
		const sSubProperty = oConfig.get('property.subproperty');
		const sSubProperty2 = oConfig.get('property.subproperty2');
		expect(sSubProperty).to.be.equal('overwrited_value_sub');
		expect(sSubProperty2).to.be.equal('value_sub2');

		done();
	});

	it('should return default value if the property is not defined', done => {
		const sFilePath = path.join(__dirname, 'application.json');
		const oConfig = Config.fromFile(fs, sFilePath);

		oConfig.setEnv('development');
		const sValue = oConfig.get('nothing', 'my_default');
		expect(sValue).to.be.equal('my_default');

		const sHost = oConfig.get('host', 'my_default');
		expect(sHost).to.not.be.equal('my_default');

		const oProperty = oConfig.get('property', 'my_default');
		expect(oProperty).to.be.a('object');
		expect(oProperty.subproperty).to.be.equal('overwrited_value_sub');
		expect(oProperty.subproperty2).to.be.equal('value_sub2');

		const sNothingValue = oConfig.get('nothing.nothing', 'my_default');
		expect(sNothingValue).to.be.equal('my_default');

		done();
	});

	it('should support complexe inheritance', done => {
		const sFilePath = path.join(__dirname, 'application.json');
		const oConfig = Config.fromFile(fs, sFilePath);

		oConfig.setEnv('test');

		const iPort = oConfig.get('port');
		expect(iPort).to.be.equal(8888);

		const sHost = oConfig.get('host');
		expect(sHost).to.be.equal('localhost');

		const sName = oConfig.get('name');
		expect(sName).to.be.equal('production');

		done();
	});

	it('should return complete config if get without key', done => {
		const sFilePath = path.join(__dirname, 'application.json');
		const oConfig = Config.fromFile(fs, sFilePath);

		oConfig.setEnv('test');

		const oConfigObject = oConfig.get();
		expect(oConfigObject).to.be.a('object');
		expect(oConfigObject.port).to.be.equal(8888);
		expect(oConfigObject.host).to.be.equal('localhost');
		expect(oConfigObject.name).to.be.equal('production');

		done();
	});

	it('should return a new object if get with an array of keys', done => {
		const sFilePath = path.join(__dirname, 'application.json');
		const oConfig = Config.fromFile(fs, sFilePath);

		oConfig.setEnv('test');

		const oSubConfig = oConfig.get(['port', 'host', 'name', 'inexistant-property'], [undefined, undefined, undefined, 123]);
		expect(oSubConfig).to.be.a('object');
		expect(Object.keys(oSubConfig).length).to.be.equal(4);
		expect(oSubConfig.port).to.be.equal(8888);
		expect(oSubConfig.host).to.be.equal('localhost');
		expect(oSubConfig.name).to.be.equal('production');
		expect(oSubConfig['inexistant-property']).to.be.equal(123);

		done();
	});

	it('should throw error if use with an incorrect key', done => {
		const sFilePath = path.join(__dirname, 'application.json');
		const oConfig = Config.fromFile(fs, sFilePath);

		oConfig.setEnv('test');

		expect(() => oConfig.get({}))
		.to.throw('The key passed as argument must be a string or an array of strings.');

		expect(() => oConfig.get(123))
		.to.throw('The key passed as argument must be a string or an array of strings.');

		done();
	});
});
