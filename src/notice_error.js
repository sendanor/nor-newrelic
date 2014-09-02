/** Custom Newrelic actions
 * Copyright (c) 2014 Sendanor <info@sendanor.com>
 * Copyright (c) 2014 Jaakko-Heikki Heusala <jheusala@iki.fi>
 */

"use strict";

var debug = require('nor-debug');
var nr = require('./nr.js');

/** NewRelic `nr.noticeError()` */
module.exports = function nr_notice_error(error) {
	debug.error(error);
	if(nr.nr) {
		nr.nr.noticeError(error);
	}
};

/* EOF */
