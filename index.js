var _ = require('lodash');
var events = require('events');
var request = require('superagent');
var util = require('util');

function Scio(config) {
	this.version = '0.0.1'; // Version (auto-bump)

	/**
	* Object containing all config
	* @type object
	*/
	this.config = {
		version: this.version,
		url: 'http://localhost',
		token: 'FAKE',
		timeout: 30 * 1000,
	};
	_.assign(this.config, config); // Import options if given in constructor

	this.getServers = function(next) {
		request.get(this.config.url + '/api/servers')
			.send({token: this.config.token})
			.timeout(this.config.timeout)
			.end(function(err, res) {
				if (err) return next(err);
				if (!res.ok) return next("Failed query, return code: " + res.statusCode + ' - ' + res.text);
				if (!res.body || !res.body.length) return next('No profiles found');
				next(null, res.body);
			});
		return this;
	};

	this.getServices = function(next) {
		request.get(this.config.url + '/api/services')
			.query({populate: 'server'})
			.send({token: this.config.token})
			.timeout(this.config.timeout)
			.end(function(err, res) {
				if (err) return next(err);
				if (!res.ok) return next("Failed query, return code: " + res.statusCode + ' - ' + res.text);
				if (!res.body || !res.body.length) return next('No profiles found');
				next(null, res.body);
			});
		return this;
	};
};
util.inherits(Scio, events.EventEmitter);

module.exports = function ScioInit(config) {
	return new Scio(config);
};
