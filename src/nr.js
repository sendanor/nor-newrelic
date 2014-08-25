/** Custom Newrelic actions
 * Copyright (c) 2014 Sendanor <info@sendanor.com>
 * Copyright (c) 2014 Jaakko-Heikki Heusala <jheusala@iki.fi>
 */

"use strict";

var debug = require('nor-debug');

/** Returns true if module exists */
function module_exists(name) {
	try {
		require.resolve(name);
		return true;
	} catch(e) {
		return false;
	}
}

var mod = module.exports = {};

/** */
mod.enable = function() {

	if(mod.nr) {
		return mod.nr;
	}

	if(module_exists("newrelic")) {
		try {
			mod.nr = require("newrelic");
			return mod.nr;
		} catch(e) {
			debug.error('Failed to enable support for NewRelic: ', e);
		}
	}
};

// Enable if NEW_RELIC_ENABLED exists already
var NEW_RELIC_ENABLED = ((''+process.env.NEW_RELIC_ENABLED).toUpperCase() === 'TRUE') ? true : false;
if(NEW_RELIC_ENABLED) {
	mod.enable();
}

/* EOF */
