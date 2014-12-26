/** Custom Newrelic actions
 * Copyright (c) 2014 Sendanor <info@sendanor.com>
 * Copyright (c) 2014 Jaakko-Heikki Heusala <jheusala@iki.fi>
 */

"use strict";

var $Q = require('q');
var debug = require('nor-debug');
var FUNCTION = require('nor-function');

var nr = require('./nr.js');

/* */
function defer_resolver(defer, err, result) {
	//debug.log('err = ', err);
	//debug.log('result = ', result);
	if(err) {
		defer.reject(err);
	} else {
		defer.resolve(result);
	}
}

/** NewRelic `createTracer()` as `Q.nfbind({string} name, {function} fun)` style implementation
 * @param name {string} The name for `nr.createTracer()`
 * @param fun {function} The function that is using Node style format `function([args], {function(err, result)})`
 * @returns {function} Wrapped function which returns promises
 */
module.exports = function nr_nfbind(name, fun) {

	//debug.log('name=', name, ' and fun=', (typeof fun), ' and nr.nr=', (typeof nr.nr));

	debug.assert(arguments.length).equals(2);
	debug.assert(name).is('string');
	debug.assert(fun).is('function');

	//debug.log('nr = ', nr);
	//debug.log('nr.nr = ', nr.nr);
	//debug.log('name = ', name);
	//debug.log('fun = ', fun);

	if(!nr.nr) {
		return $Q.nfbind(fun);
	}

	return function nr_nfbind_wrapper() {
		var defer = $Q.defer();
		var args = Array.prototype.slice.call(arguments);
		args.push( nr.nr.createTracer(name, FUNCTION(defer_resolver).curry(defer)) );
		//debug.log('args = ', args);
		FUNCTION(fun).curryApply(args);
		return defer.promise;
	};
};

/* EOF */
