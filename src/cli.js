#!/usr/bin/env node
var Q = require('q');
var debug = require('nor-debug');
var is = require('nor-is');
var argv = require('optimist').boolean('v').argv;
var util = require('util');
var newrelic_rest = require('./index.js');
var FS = require('nor-fs');
var PATH = require('path');

var comname = PATH.basename( argv.$0 ) || 'nor-newrelic';

var CONFIG_FILE = PATH.resolve( process.env.HOME, '.nor-newrelic.json');

// -v -- enable verbose mode
if(argv.v) {
	debug.setNodeENV('development');
} else {
	debug.setNodeENV('production');
}

/* Configurations on disk */

/** Read configurations from disk */
function read_config(path) {
	debug.assert(path).is('string');
	return FS.exists(path).then(function read_file(exists) {
		if(!exists) {
			return {};
		}
		return FS.readFile(path, {'encoding':'utf8'}).then(function parse_json(data) {
			debug.assert(data).is('string');
			return JSON.parse(data);
		});
	}).then(function init_config(config) {
		debug.assert(config).is('object');

		if(config.applications === undefined) {
			config.applications = {};
		}

		return config;
	});
}

/** Save configurations to disk */
function save_config(path, config) {
	debug.assert(path).is('string');
	debug.assert(config).is('object');
	return Q.fcall(function stringify_json() {
		return JSON.stringify(config, null, 2);
	}).then(function write_to_file(data) {
		return FS.writeFile(path, data, {'encoding':'utf8'});
	});
}

/* Commands */
var commands = {};

/** Deploy command */
commands.help = function(opts) {
	console.log([
		'USAGE: '+comname+' [OPTION(S)] deploy|help|save',
		'',
		'..where options are:',
		'',
		'   -v                         Verbose output of what is happening',
		'',
		'..where options for deploy and save are:',
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

/** Save config */
commands.save = function(opts, args) {
	
	// Parse config_key
	var config_key;
	if(args.application_id) {
		config_key = args.application_id;
	} else if(args.app_name) {
		config_key = args.app_name;
	}

	return Q.fcall(function read_file() {
		return read_config(CONFIG_FILE);
	}).then(function save_file(config) {
		config.applications[config_key] = args;
		return save_config(CONFIG_FILE, config);
	});
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

return Q.fcall(function get_config() {
	return read_config(CONFIG_FILE);
}).then(function do_actions(config) {

	debug.log('argv = ', argv);
	var args = prepare_args(argv);
	debug.log('args = ', args);

	// Parse app_config
	var app_config = {};
	if(args.application_id && is.obj(config.applications[args.application_id])) {
		app_config = config.applications[args.application_id];
	} else if(args.app_name && is.obj(config.applications[args.app_name])) {
		app_config = config.applications[args.app_name];
	}

	// Save command line arguments
	var cli_args = {};
	Object.keys(args).forEach(function(key) {
		cli_args[key] = args[key];
	});

	// Copy defaults from app_config
	Object.keys(app_config).forEach(function(key) {
		if(args[key] === undefined) {
			args[key] = app_config[key];
		}
	});

	return actions.map(function action_pre(command) {
		debug.log('command = ', command);
		return function action() {
			return Q.when(commands[command](args, cli_args)).then(function action_post() {
				console.log(comname + ': ' + command + ': successful');
			}).fail(function(err) {
				debug.log(err);
				throw new TypeError(command + ': ' + err);
			});
		};
	}).reduce(Q.when, Q());

}).fail(function(err) {
	util.error(comname + ': '+err);
}).done();

/* EOF */
