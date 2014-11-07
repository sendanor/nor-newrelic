/** Custom Newrelic actions
 * Copyright (c) 2014 Sendanor <info@sendanor.com>
 * Copyright (c) 2014 Jaakko-Heikki Heusala <jheusala@iki.fi>
 */

"use strict";

var debug = require('nor-debug');
var nr = require('./nr.js');

/** Record custom metric */
module.exports = function nr_increment_metric(name, amount) {
	debug.assert(name).is('string');
	//debug.assert(amount).is('defined');
	if(!nr.nr) { return; }
	if(arguments.length === 1) {
		nr.nr.incrementMetric(name);
	} else {
		nr.nr.incrementMetric(name, amount);
	}
};

/* EOF */
