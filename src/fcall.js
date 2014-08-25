/** Custom Newrelic actions
 * Copyright (c) 2014 Sendanor <info@sendanor.com>
 * Copyright (c) 2014 Jaakko-Heikki Heusala <jheusala@iki.fi>
 */

"use strict";

var $Q = require('q');
var debug = require('nor-debug');

var nr = require('./nr.js');

/** NewRelic `createTracer()` as `$Q.fcall({function})` style implementation */
module.exports = function nr_fcall(name, fun) {
	//debug.log('name=', name, ' and fun=', (typeof fun), ' and nr.nr=', (typeof nr.nr));
	if(!nr.nr) {
		return $Q.fcall(fun);
	}
	debug.assert(name).is('string');
	debug.assert(fun).is('function');
	var tracer = nr.nr.createTracer(name, function() {});
	debug.assert(tracer).is('function');
	return $Q.fcall(fun).then(function(result) {
		tracer(undefined, result);
		return result;
	}).fail(function(err) {
		tracer(err);
		throw err;
	});
};

/* EOF */
