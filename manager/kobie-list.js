#!/usr/bin/env node

'use strict';

const Program = require('commander');
const Engine = require('./engine');
const Manifest = require('./manifest');
const Chalk = require('chalk');

Manifest.init();
Program.parse(process.argv);

console.log();
console.log(Chalk.grey('Legend:'));
console.log(Chalk.grey('----------------------------------------------------------------'));
console.log('[i]: index');
console.log('%s: group', Chalk.green('green'));
console.log('%s: interaction', Chalk.yellow('yellow'));
console.log(Chalk.grey('----------------------------------------------------------------'));
console.log();

Engine.list(Manifest.$data.components, Manifest.$data.groups);
