/** Custom Newrelic actions
 * Copyright (c) 2014 Sendanor <info@sendanor.com>
 * Copyright (c) 2014 Jaakko-Heikki Heusala <jheusala@iki.fi>
 */

"use strict";

var $Q = require('q');
var debug = require('nor-debug');
var nr = require('./nr.js');
var tr_fcall = require('./tr_fcall.js');
var FUNCTION = require('nor-function');

/** The `newrelic.createBackgroundTracer()` and `newrelic.endTransaction()` as `$Q.fcall({function})`
 * style implementation
 */
module.exports = function nr_btfcall(url, fun) {
	debug.assert(url).is('string');
	debug.assert(fun).is('function');

	//debug.log('name=', name, ' and fun=', (typeof fun), ' and nr.nr=', (typeof nr.nr));
	if(!nr.nr) {
		return $Q.fcall(fun);
	}

	var defer = $Q.defer();
	var call = nr.nr.createBackgroundTransaction(url, FUNCTION(tr_fcall).curry(nr, defer, fun) );
	call();
	return defer.promise;
};

/* EOF */
