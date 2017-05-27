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
    },

    validateInteraction: function(group_name) {
        var parts = group_name.split('/');

        // Check format
        if (parts.length !== 2) {
            console.log(
                Chalk.red(
                    'Error: A new interaction name must comprise of a group, a single forward-slash, and a name e.g. user/create.'
                )
            );
            return false;
        }

        // Check for duplication
        if (this.interactionExists(group_name)) {
            console.log(
                Chalk.red(
                    'Error: A interaction with the name "%s" already exists in the "%s" group.'
                ),
                parts[1],
                parts[0]
            );
            return false;
        }

        return true;
    },

    interactionExists: function(group_name) {
        var _this = this;
        var parts = group_name.split('/'), groupIndex = _this.getGroupIndex(parts[0]);

        if (groupIndex !== -1) {
            for (var i = 0; i < _this.$data.groups[groupIndex].interactions.length; i++) {
                var c = _this.$data.groups[groupIndex].interactions[i];

                if (c.name === parts[1]) {
                    return true;
                }
            }
        }

        return false;
    },

    groupExists: function(group_name) {
        var parts = group_name.split('/');

        return this.getGroupIndex(parts[0]) === -1 ? false : true;
    },

    getGroupIndex: function(group) {
        return this.$data.groups.findIndex(function(item) {
            return item.name === group;
        });
    },

    getInteractionIndex: function(group_name) {
        var _this = this, parts = group_name.split('/'), groupIndex = _this.getGroupIndex(parts[0]);

        if (groupIndex !== -1) {
            for (var i = 0; i < _this.$data.groups[groupIndex].interactions.length; i++) {
                var c = _this.$data.groups[groupIndex].interactions[i];

                if (c.name === parts[1]) {
                    return i;
                }
            }
        }
    },

    getGroupPositionChoices: function() {
        var choices = [
            {
                name: 'Position first',
                value: 0
            }
        ],
            n = 1;

        for (var i = 0; i < this.$data.groups.length; i++) {
            var g = this.$data.groups[i];

            choices.push({
                name: 'Position after ' + g.name,
                value: n
            });

            n++;
        }

        return choices;
    },

    getInteractionPositionChoices: function(group) {
        var _this = this,
            groupIndex = _this.getGroupIndex(group),
            choices = [
                {
                    name: 'Position first',
                    value: 0
                }
            ];

        for (var i = 0; i < _this.$data.groups[groupIndex].interactions.length; i++) {
            var c = _this.$data.groups[groupIndex].interactions[i];
            choices.push({
                name: 'Position after ' + Chalk.yellow(c.name),
                value: i + 1
            });
        }

        return choices;
    },

    createInteractionFiles: function(interaction) {
        var _this = this,
            group_path = this.$root + '/interactions/' + interaction.group,
            interaction_path = group_path + '/' + interaction.name,
            error = false;

        Fs.exists(Utils.pathify(group_path), function(r) {
            if (r) {
                _this.createInteractionFolder(interaction_path);
            } else {
                _this.createGroupFolder(group_path, function() {
                    _this.createInteractionFolder(interaction_path);
                });
            }
        });

        return !error;
    },

    createInteractionFolder: function(interaction_path, callback) {
        callback = typeof callback !== 'undefined' ? callback : function() {};

        var _this = this, error = false;

        Fs.mkdir(Utils.pathify(interaction_path), function(err) {
            if (err) {
                console.log(Chalk.red('Error: ' + err));
                error = true;
                return;
            }

            Fs.writeFile(Utils.pathify(interaction_path + '/markup.html'), '', function(err) {
                if (err) {
                    console.log(Chalk.red('Error: ' + err));
                    error = true;
                    return;
                }

                Fs.writeFile(Utils.pathify(interaction_path + '/description.md'), '', function(
                    err
                ) {
                    if (err) {
                        console.log(Chalk.red('Error: ' + err));
                        error = true;
                        return;
                    }

                    return callback();
                });
            });
        });

        return !error;
    },

    createGroupFolder: function(group_path, callback) {
        var _this = this;

        callback = typeof callback !== 'undefined' ? callback : function() {};

        Fs.mkdir(group_path, function(err) {
            if (err) {
                console.log(Chalk.red('Error: ' + err));
                var error = true;
                return;
            }

            _this.createGroupDescription(group_path);

            return callback();
        });
    },

    createGroupDescription: function(group_path) {
        var _this = this;

        Fs.exists(Utils.pathify(group_path + '/description.md'), function(r) {
            if (!r) {
                Fs.writeFile(Utils.pathify(group_path + '/description.md'), '', function(err) {
                    if (err) {
                        console.log(Chalk.red('Error: ' + err));
                        var error = true;
                        return;
                    }
                });
            }
        });
    },

    getGroupInteractionCount: function(group) {
        return this.$data.groups[this.getGroupIndex(group)].interactions.length;
    },

    deleteGroupFolder: function(group) {
        var _this = this, group_path = this.$root + '/interactions/' + group, error = false;

        Fs.remove(Utils.pathify(group_path), function(err) {
            if (err) {
                console.log(Chalk.red('Error: ' + err));
                error = true;
            }
        });

        return !error;
    },

    deleteInteractionFiles: function(group_name) {
        var _this = this,
            interaction_path = this.$root + '/interactions/' + group_name,
            error = false;

        Fs.remove(Utils.pathify(interaction_path), function(err) {
            if (err) {
                console.log(Chalk.red('Error: ' + err));
                error = true;
            }
        });

        return !error;
    }
};
