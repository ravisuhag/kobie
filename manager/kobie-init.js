#!/usr/bin/env node

'use strict';

const Program = require('commander');
const Chalk = require('chalk');
const Engine = require('./engine');

Program.usage('[path]').description(Chalk.yellow('Initilize a new architecture repository.'));

/**
 * Override argv[1] so that usage command is
 * formatted correctly.
 */
process.argv[1] = 'patterns init';

Program.parse(process.argv);

/**
 * Initialize architecture repository.
 */
var path = Program.args[0] ? Program.args[0] : '.';
if (path) {
    Engine.setup(path, function() {
        console.log();
        console.log(Chalk.grey('----------------------------------------------------------------'));
        console.log(Chalk.green('\u2713  Architecture repository initialized successfully.'));
        console.log(Chalk.grey('----------------------------------------------------------------'));
        console.log();
        console.log(Chalk.yellow('To get started add your first interaction using:'));
        console.log();
        console.log(Chalk.yellow('$ kobie new [group_name/interaction_name]'));
        console.log();
        console.log(
            Chalk.yellow('To customise your architecture repository locate your kobie.json file')
        );
        console.log(Chalk.yellow('in ' + path + ' and add your project details.'));
        console.log();
    });
}
