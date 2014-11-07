/** Custom Newrelic actions
 * Copyright (c) 2014 Sendanor <info@sendanor.com>
 * Copyright (c) 2014 Jaakko-Heikki Heusala <jheusala@iki.fi>
 */

"use strict";

var debug = require('nor-debug');
var nr = require('./nr.js');

/** Record custom metric */
module.exports = function nr_record_metric(name, value) {
	debug.assert(name).is('string');
	debug.assert(value).is('defined');
	if(!nr.nr) { return; }
	nr.nr.recordMetric(name, value);
};

/* EOF */
