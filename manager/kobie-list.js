#!/usr/bin/env node

'use strict';

const Program = require('commander');
const Engine = require('./engine');
const Manifest = require('./manifest');

Manifest.init();

Program.parse(process.argv);

Engine.list(Manifest.$data.components, Manifest.$data.groups);
