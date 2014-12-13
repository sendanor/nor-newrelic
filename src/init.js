/* NewRelic Setup */

"use strict";

var nr = require('./nr.js');

/** Returns newrelic module if newrelic is enabled, otherwise undefined. */
module.exports = function nr_init() {
	var newrelic;
	var NEW_RELIC_ENABLED = (''+process.env.NEW_RELIC_ENABLED).toLowerCase() === 'true';
	if(NEW_RELIC_ENABLED) {
		process.env.NEW_RELIC_ENABLED = 'TRUE';
		newrelic = require('newrelic');
		nr.enable();
	} else {
		process.env.NEW_RELIC_ENABLED = 'FALSE';
	}
	return newrelic;
};

/* EOF */
