'use strict';

const Fs = require('fs-extra');
const Chalk = require('Chalk');
const Dir = require('global-modules');
const Pkg = require('../package.json');
const Utils = require('./utils');

module.exports = {
    $filename: 'kobie.json',
    $root: process.cwd(),
    $module_path: Dir + '/' + Pkg.name,
    $data: {},

    init: function() {
        var _this = this;
        try {
            _this.$data = _this.get();
        } catch (e) {
            throw new Error(Chalk.red(_this.$filename + ' file not found in project root.'));
        }
    },

    exists: function() {
        var _this = this;
        Fs.exists(_this.$filename, function(r) {
            if (r) {
                throw new Error(Chalk.red('Kobie has already been initialized.'));
            }
        });
    },

    get: function() {
        var _this = this;
        return JSON.parse(Fs.readFileSync(Utils.pathify(_this.$root + '/' + _this.$filename)));
    },

    save: function(data, callback) {
        var _this = this;
        _this.$data = Utils.merge(_this.$data, data);
        Fs.writeFile(
            Utils.pathify(this.$root + '/' + _this.$filename),
            JSON.stringify(_this.$data, null, 4),
            function(err) {
                if (err) {
                    throw new Error(Chalk.red('Kobie has already been initialized.'));
                }
                return callback();
            }
        );
    }
};
