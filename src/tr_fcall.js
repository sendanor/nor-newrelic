/** Custom Newrelic actions
 * Copyright (c) 2014 Sendanor <info@sendanor.com>
 * Copyright (c) 2014 Jaakko-Heikki Heusala <jheusala@iki.fi>
 */

"use strict";

var $Q = require('q');

/** */
module.exports = function nr_tr_fcall(nr, defer, fun) {
	$Q.fcall(fun).then(function(res) {
		defer.resolve(res);
	}).fail(function(err) {
		nr.nr.noticeError(err);
		defer.reject(err);
	}).fin(function() {
		nr.nr.endTransaction();
	}).done();
};

/* EOF */
