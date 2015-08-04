#!/usr/bin/env node

var colors = require('colors');
var fs = require('fs');
var homedir = require('homedir');
var ini = require('ini');
var program = require('commander');
var request = require('superagent');
var _ = require('lodash');
var version = '0.0.1'; // Version (auto-bump)

program
	.version(version)
	.usage('<action>')
	.option('-v, --verbose', 'Be verbose')
	.option('--no-color', 'Disable colors')
	.parse(process.argv);

// Config {{{
// Default config {{{
program.config = { // Scio specific settings can be found in ./index.js
	formatting: {
		date: 'YYYY-DD-MM HH:mm',
		tables: {
			chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''}, // See https://github.com/Automattic/cli-table#custom-styles
			style: {'padding-left': 1, 'padding-right': 1, head: ['blue'], border: ['grey'], compact : false},
		}
	},
};
// }}}
// Find Config {{{
var home = homedir();
var iniLocations = [
	'/etc/scio.ini',
	(home ? home + '/.scio.ini' : null),
	'./scio.ini',
];
// }}}
// Read in config {{{
var iniFile = _(iniLocations)
	.compact()
	.find(fs.existsSync);
if (iniFile) {
	program.config.iniFile = iniFile;
	_.merge(program.config, ini.parse(fs.readFileSync(program.config.iniFile, 'utf-8')));
}
// }}}
// }}}
// Extract command {{{
if (!program.args.length) {
	console.log('No command given');
	process.exit(1);
}
program.command = program.args.shift();
// }}}
// Create Scio instance {{{
var scio = require('./index')(program.config);
// }}}
// Load all commands {{{
program.commands = {
	config: require('./commands/config'),
	servers: require('./commands/servers'),
	services: require('./commands/services'),
	setup: require('./commands/setup'),
};
// }}}

if (program.commands[program.command]) {
	program.commands[program.command](function(err) {
		if (err) console.log(colors.red('ERROR'), err);
		// All done
		process.exit(0);
	}, scio);
} else {
	console.log(console.red('ERROR'), 'Unknown command:', program.command);
	process.exit(1);
}
