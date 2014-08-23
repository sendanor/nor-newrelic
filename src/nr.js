/** Custom Newrelic actions
 * Copyright (c) 2014 Sendanor <info@sendanor.com>
 * Copyright (c) 2014 Jaakko-Heikki Heusala <jheusala@iki.fi>
 */

"use strict";

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

mod.enable = function() {

	if(mod.nr) {
		return mod.nr;
	}

	if(module_exists("newrelic")) {
		try {
			mod.nr = require("newrelic");
		} catch(e) {
			debug.warn('Failed to enable support for NewRelic.');
		}
	}
};

/* EOF */
