import {describe, it} from 'mocha';
import {expect} from 'chai';
import path from 'path';
import fs from 'fs';
import Config from '../lib';

describe('voo-config', () => {
	it('should load from object', done => {
		Config.fromObject({
			development: {
				name: 'root'
			}
		});
		Config.setEnv('development');
		const sName = Config.get('name');
		expect(sName).to.be.equal('root');

		done();
	});

	it('should reset when needed', done => {
		// setup
		Config.fromObject({
			development: {
				name: 'root'
			}
		});
		Config.setEnv('development');
		const sName = Config.get('name');
		expect(sName).to.be.equal('root');

		Config.reset();
		const sNewName = Config.get('name');
		expect(sNewName).to.be.an('undefined');

		done();
	});

	it('should throw error if try to load from file with missing FileSystem package', done => {
		Config.reset();

		const sError = 'FileSystem package has not been provided as first argument.';

		const sFilePath = path.join(__dirname, 'application.json');
		expect(() => Config.fromFile(sFilePath)).to.throw(sError);
		expect(() => Config.fromFile(sFilePath, fs)).to.throw(sError);
		expect(() => Config.fromFile({}, sFilePath)).to.throw(sError);
		expect(() => Config.fromFile(undefined, sFilePath)).to.throw(sError);

		done();
	});

	it('should load from file', done => {
		Config.reset();

		const sFilePath = path.join(__dirname, 'application.json');
		Config.fromFile(fs, sFilePath);

		Config.setEnv('development');
		const iPort = Config.get('port');
		expect(iPort).to.be.equal(8080);

		done();
	});

	it('should be possible to get parameter', done => {
		Config.setEnv('development');
		const iPort = Config.get('port');
		expect(iPort).to.be.equal(8080);

		done();
	});

	it('should be possible to change environment', done => {
		Config.setEnv('development');
		const iPortDev = Config.get('port');
		expect(iPortDev).to.be.equal(8080);

		Config.setEnv('production');
		const iPortProd = Config.get('port');
		expect(iPortProd).to.be.equal(8002);

		done();
	});

	it('should be possible to retrieve a parameter inherit from an env, an other overwrite by another env', done => {
		Config.setEnv('production');
		const sName = Config.get('name');
		const sHost = Config.get('host');
		expect(sName).to.be.equal('production');
		expect(sHost).to.be.equal('localhost');

		done();
	});

	it('should be possible to retrieve an array', done => {
		Config.setEnv('production');
		const aList = Config.get('list');
		expect(aList).to.be.a('array');
		expect(aList).to.have.length(3);

		const aModel = ['first', 'second', 'third'];
		for (let i = 0; i < aList.length; i++) {
			expect(aList[i]).to.be.equal(aModel[i]);
		}

		done();
	});

	it('should be possible to retrieve an overwrited array', done => {
		Config.setEnv('development');
		const aList = Config.get('list2');
		expect(aList).to.be.a('array');
		expect(aList).to.have.length(3);

		const aModel = ['first', 'second', 'third'];
		for (let i = 0; i < aList.length; i++) {
			expect(aList[i]).to.be.equal(aModel[i]);
		}

		done();
	});

	it('should be possible to retrieve an object', done => {
		Config.setEnv('production');
		const oProperty = Config.get('property');
		expect(oProperty).to.be.a('object');
		expect(oProperty.subproperty).to.be.equal('value_sub');
		expect(oProperty.subproperty2).to.be.equal('value_sub2');

		done();
	});

	it('should be possible to retrieve an object with an overwrited subproperty', done => {
		Config.setEnv('development');
		const oProperty = Config.get('property');
		expect(oProperty).to.be.a('object');
		expect(oProperty.subproperty).to.be.equal('overwrited_value_sub');
		expect(oProperty.subproperty2).to.be.equal('value_sub2');

		done();
	});

	it('should be possible to retrieve directly a property from an object', done => {
		Config.setEnv('development');
		const sSubProperty = Config.get('property.subproperty');
		const sSubProperty2 = Config.get('property.subproperty2');
		expect(sSubProperty).to.be.equal('overwrited_value_sub');
		expect(sSubProperty2).to.be.equal('value_sub2');

		done();
	});

	it('should return default value if the property is not defined', done => {
		Config.setEnv('development');
		const sValue = Config.get('nothing', 'my_default');
		expect(sValue).to.be.equal('my_default');

		const sHost = Config.get('host', 'my_default');
		expect(sHost).to.not.be.equal('my_default');

		const oProperty = Config.get('property', 'my_default');
		expect(oProperty).to.be.a('object');
		expect(oProperty.subproperty).to.be.equal('overwrited_value_sub');
		expect(oProperty.subproperty2).to.be.equal('value_sub2');

		const sNothingValue = Config.get('nothing.nothing', 'my_default');
		expect(sNothingValue).to.be.equal('my_default');

		done();
	});

	it('should support complexe inheritance', done => {
		Config.setEnv('test');

		const iPort = Config.get('port');
		expect(iPort).to.be.equal(8888);

		const sHost = Config.get('host');
		expect(sHost).to.be.equal('localhost');

		const sName = Config.get('name');
		expect(sName).to.be.equal('production');

		done();
	});

	it('should return complete config if get without key', done => {
		Config.setEnv('test');

		const oConfig = Config.get();
		expect(oConfig).to.be.a('object');
		expect(oConfig.port).to.be.equal(8888);
		expect(oConfig.host).to.be.equal('localhost');
		expect(oConfig.name).to.be.equal('production');

		done();
	});

	it('should return a new object if get with an array of keys', done => {
		Config.setEnv('test');

		const oSubConfig = Config.get(['port', 'host', 'name', 'inexistant-property'], [undefined, undefined, undefined, 123]);
		expect(oSubConfig).to.be.a('object');
		expect(Object.keys(oSubConfig).length).to.be.equal(4);
		expect(oSubConfig.port).to.be.equal(8888);
		expect(oSubConfig.host).to.be.equal('localhost');
		expect(oSubConfig.name).to.be.equal('production');
		expect(oSubConfig['inexistant-property']).to.be.equal(123);

		done();
	});

	it('should throw error if use with an incorrect key', done => {
		Config.setEnv('test');

		expect(() => Config.get({}))
		.to.throw('The key passed as argument must be a string or an array of strings.');

		expect(() => Config.get(123))
		.to.throw('The key passed as argument must be a string or an array of strings.');

		done();
	});
});
