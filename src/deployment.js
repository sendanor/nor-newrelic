/** Custom Newrelic actions
 * Copyright (c) 2014 Sendanor <info@sendanor.com>
 * Copyright (c) 2014 Jaakko-Heikki Heusala <jheusala@iki.fi>
 */

"use strict";

var debug = require('nor-debug');
var ARRAY = require('nor-array');
var request = require('nor-rest').request;

/** Record new deployment
 * See http://newrelic.github.io/newrelic_api/NewRelicApi/Deployment.html
 * @param opts.api_key {string} The API key
 * @param opts.application_id {string} The application ID
 * @param opts.app_name {string} The application name
 * @param opts.description {string} Optional description of deployment
 * @param opts.revision {string} Optional revision number from your source control system
 * @param opts.changelog {string} Optional changes for this deployment
 * @param opts.user {string} Optional name of the user/process that triggered this deployment
 */
module.exports = function nor_newrelic_deployment(opts) {
	opts = opts || {};

	// curl -H "x-api-key:REPLACE_WITH_YOUR_API_KEY" -d "deployment[app_name]=REPLACE_WITH_YOUR_APP_NAME" https://api.newrelic.com/deployments.xml

	// Check parameters
	debug.assert(opts.api_key).ignore(undefined).is('string');
	debug.assert(opts.app_name).ignore(undefined).is('string');
	debug.assert(opts.application_id).ignore(undefined).is('string');
	debug.assert(opts.description).ignore(undefined).is('string');
	debug.assert(opts.revision).ignore(undefined).is('string');
	debug.assert(opts.changelog).ignore(undefined).is('string');
	debug.assert(opts.user).ignore(undefined).is('string');

	if(!( opts.app_name || opts.application_id )) {
		throw new TypeError("opts.app_name or opts.application_id required!");
	}

	if(!opts.api_key) {
		throw new TypeError("Missing required opts.api_key");
	}
	debug.log('opts = ', opts);

	// Build body
	var data = {};
	ARRAY(['app_name', 'application_id','description','revision','changelog','user']).forEach(function(key) {
		if(opts[key] !== undefined) {
			data['deployment['+ key +']'] = opts[key];
		}
	});
	debug.log('data = ', data);

	var body = require('querystring').stringify(data);
	debug.log('body = ', body);

	// Create request
	debug.log('POSTing to https://api.newrelic.com/deployments.xml...');
	return request.plain('https://api.newrelic.com/deployments.xml', {
		'method': 'POST',
		'headers': {
			'Content-Type': 'application/x-www-form-urlencoded;charset=utf8',
			'x-api-key': opts.api_key
		},
		'body': body
	});

};

/* EOF */
