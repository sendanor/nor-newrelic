/** Custom Newrelic actions
 * Copyright (c) 2014 Sendanor <info@sendanor.com>
 * Copyright (c) 2014 Jaakko-Heikki Heusala <jheusala@iki.fi>
 */

"use strict";

var $Q = require('q');
var debug = require('nor-debug');

var nr = require('./nr.js');

/** The `newrelic.createWebTracer()` and `newrelic.endTransaction()` as `$Q.fcall({function})`
 * style implementation
 */
module.exports = function nr_create_web_transaction(url, fun) {
	debug.assert(url).is('string');
	debug.assert(fun).is('function');

	//debug.log('name=', name, ' and fun=', (typeof fun), ' and nr.nr=', (typeof nr.nr));
	if(!nr.nr) {
		$Q.fcall(fun).fail(function(err) {
			debug.error(err);
		}).done();
		return;
	}

	var call = nr.nr.createWebTransaction(url, function custom_web_transaction() {
		$Q.fcall(fun).fail(function(err) {
			debug.error(err);
			nr.nr.noticeError(err);
		}).fin(function() {
			nr.nr.endTransaction();
		}).done();
	});

	call();

};

/* EOF */
