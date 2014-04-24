#!/usr/bin/env node
var Q = require('q');
var debug = require('nor-debug');
var argv = require('optimist').boolean('v').argv;
var util = require('util');
var newrelic_rest = require('./index.js');
var PATH = require('path');

var comname = PATH.basename( argv.$0 ) || 'nor-newrelic';

// -v -- enable verbose mode
if(argv.v) {
	debug.setNodeENV('development');
} else {
	debug.setNodeENV('production');
}

var commands = {};

/** Deploy command */
commands.help = function(opts) {
	console.log([
		'USAGE: '+comname+' [OPTION(S)] deploy|help',
		'',
		'..where options are:',
		'',
		'   -v                         Verbose output of what is happening',
		'',
		'..where options for deploy are:',
		'',
		'   --api-key={string}         The API key',
		'   --application-id={string}  The application ID',
		'   --app-name={string}        The application name',
		'   --description={string}     Optional description of deployment',
		'   --revision={string}        Optional revision number from your source control system',
		'   --changelog={string}       Optional changes for this deployment',
		'   --user={string}            Optional name of the user/process that triggered this deployment'
	].join('\n') + '\n');
};

/** Deploy command */
commands.deploy = function(opts) {
	return newrelic_rest.deployment(opts);
};

var actions = [].concat(argv._);

/** Prepare arguments */
function prepare_args(args) {
	var tmp = {};
	Object.keys(args).filter(function(key) {
		return key.length >= 3;
	}).forEach(function(key) {
		tmp[key.replace(/\-/g, '_')] = '' + args[key];
	});
	return tmp;
}

/** Do commands */
if(actions.length === 0) {
	actions.push('help');
}

actions.map(function action_pre(command) {
	debug.log('command = ', command);
	debug.log('argv = ', argv);
	var args = prepare_args(argv);
	debug.log('args = ', args);
	return function action() {
		return Q.when(commands[command](args)).then(function action_post() {
			console.log(comname + ': ' + command + ': successful');
		}).fail(function(err) {
			debug.log(err);
			throw new TypeError(command + ': ' + err);
		});
	};
}).reduce(Q.when, Q()).fail(function(err) {
	util.error(comname + ': '+err);
}).done();

/* EOF */
