#!/usr/bin/env node

const Program = require('commander');
const Chalk = require('chalk');
const Updater = require('update-notifier');
const Engine = require('./engine');
const Manifest = require('./engine');
const Pkg = require('../package.json');

Updater({ pkg: Pkg }).notify();

Program.version(Pkg.version)
    .usage('[command]')
    .command('init', 'initialize new project')
    .command('update', 'update existing project')
    .command('new', 'create a new interaction')
    .command('edit', 'edit a interaction and/or group')
    .command('delete', 'delete interaction and/or group')
    .command('list', 'list flows')
    .option('-I, --instance', 'output the instance version number')
    .parse(process.argv);

if (!process.argv.slice(2).length) {
    Program.outputHelp();
}

/**
 * Get instance version number.
 */
if (Program.instance) {
    try {
        if (Manifest.get()) {
            Manifest.init();
            console.log(
                Chalk.grey('This Kobie instance version is: ') +
                    Chalk.green(Manifest.$manifest.version)
            );
        }
    } catch (e) {
        console.log(Chalk.red('Kobie has not been initialised.'));
    }
}
