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

        Manifest.exists();

        Mkdirp(path, function(err) {
            if (err) {
                console.error(Chalk.red('Error: ' + err));
            }

            Fs.copy(Utils.pathify(_this.$module_path + '/_template'), path, function(err) {
                if (err) {
                    console.log(Chalk.red('Error: ' + err));
                }

                Manifest.init();

                Manifest.save(
                    {
                        path: path,
                        name: 'Architect',
                        version: Pkg.version
                    },
                    function() {
                        return callback();
                    }
                );
            });
        });
    },

    list: function(interactions, groups) {
        if (groups.length) {
            for (var i = 0; i < groups.length; i++) {
                var g = groups[i];

                console.log('[%s] %s:', i, Chalk.green(g.name));

                var k = 0;
                for (var j = 0; j < groups[i].interactions.length; j++) {
                    var c = groups[i].interactions[j];

                    if (c.group === g.name) {
                        console.log(
                            '     %s [%s] %s',
                            String.fromCharCode(0x21b3),
                            k,
                            Chalk.yellow(c.name)
                        );
                        k++;
                    }
                }
            }
        } else {
            console.log('Your architecture repository is empty.');
        }
        console.log();
    }
};
