const Chalk = require('Chalk');
const Mkdirp = require('mkdirp');
const Pkg = require('../package.json');
const Manifest = require('./manifest');
const Utils = require('./utils');
const Fs = require('fs-extra');
const Dir = require('global-modules');

module.exports = {
    $root: process.cwd(),
    $module_path: Dir + '/' + Pkg.name,

    setup: function(path, callback) {
        var _this = this;
        console.log('sdssdsdd');
        Manifest.exists();

        Manifest.save(
            {
                path: path,
                name: 'Architect',
                version: Pkg.version
            },
            function() {
                Mkdirp(path, function(err) {
                    if (err) {
                        console.error(Chalk.red('Error: ' + err));
                    }

                    Fs.copy(Utils.pathify(_this.$module_path + '/_template'), path, function(err) {
                        if (err) {
                            console.log(Chalk.red('Error: ' + err));
                        }
                        return callback();
                    });
                });
            }
        );
    }
};
