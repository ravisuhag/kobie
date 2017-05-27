#!/usr/bin/env node

'use strict';

const Program = require('commander');
const Chalk = require('chalk');
const Inquirer = require('inquirer');
const Manifest = require('./manifest');

Manifest.init();

Program.description(Chalk.yellow('Delete a architecture repository interaction or group.')).option(
    '-g, --group [group_name]',
    'delete group'
);

process.argv[1] = 'kobie delete';

Program.parse(process.argv);

if (!process.argv.slice(2).length) {
    Program.outputHelp();
}

/**
 * Delete individual interaction.
 */
var group_name = Program.args[0];
if (group_name) {
    var parts = group_name.split('/');

    if (Manifest.interactionExists(group_name) !== false) {
        var interactionIndex = Manifest.getInteractionIndex(group_name),
            groupIndex = Manifest.getGroupIndex(parts[0]);

        Inquirer.prompt([
            {
                type: 'confirm',
                name: 'delete',
                message: function() {
                    console.log();
                    console.log(Chalk.grey('Delete "' + parts[1] + '" interaction:'));
                    console.log(
                        Chalk.grey(
                            '----------------------------------------------------------------'
                        )
                    );
                    return Chalk.red('Are you sure you want to delete this interaction?');
                },
                default: false
            }
        ]).then(function(answers) {
            if (!answers.delete) {
                console.log();
                console.log(
                    Chalk.grey('----------------------------------------------------------------')
                );
                console.log(Chalk.green('\u2713 Deletion cancelled.'));
                console.log(
                    Chalk.grey('----------------------------------------------------------------')
                );
                console.log();
                return;
            }

            if (answers.delete) {
                var interactionCount = Manifest.getGroupInteractionCount(parts[0]);

                Manifest.$data.groups[groupIndex].interactions.splice(interactionIndex, 1);
                Manifest.deleteInteractionFiles(group_name);

                if (interactionCount === 1) {
                    Inquirer.prompt([
                        {
                            type: 'confirm',
                            name: 'delete_group',
                            message: Chalk.red(
                                'Deleting this interaction will leave it\'s parent group empty. Delete the "' +
                                    parts[0] +
                                    '" group as well?'
                            ),
                            default: true
                        }
                    ]).then(function(answers) {
                        if (!answers.delete_group) {
                            Manifest.save({}, function() {
                                console.log();
                                console.log(
                                    Chalk.grey(
                                        '----------------------------------------------------------------'
                                    )
                                );
                                console.log(
                                    Chalk.green('\u2713 Interaction deleted successfully.')
                                );
                                console.log(
                                    Chalk.grey(
                                        '----------------------------------------------------------------'
                                    )
                                );
                                console.log();
                            });
                        }

                        if (answers.delete_group) {
                            Manifest.$data.groups.splice(groupIndex, 1);
                            Manifest.deleteGroupFolder(parts[0]);

                            Manifest.save({}, function() {
                                console.log();
                                console.log(
                                    Chalk.grey(
                                        '----------------------------------------------------------------'
                                    )
                                );
                                console.log(
                                    Chalk.green(
                                        '\u2713 Group and interaction deleted successfully.'
                                    )
                                );
                                console.log(
                                    Chalk.grey(
                                        '----------------------------------------------------------------'
                                    )
                                );
                                console.log();
                            });
                        }
                    });
                } else {
                    Manifest.save({}, function() {
                        console.log();
                        console.log(
                            Chalk.grey(
                                '----------------------------------------------------------------'
                            )
                        );
                        console.log(Chalk.green('\u2713 Interaction deleted successfully.'));
                        console.log(
                            Chalk.grey(
                                '----------------------------------------------------------------'
                            )
                        );
                        console.log();
                    });
                }
            }
        });
    } else {
        console.log(Chalk.red('Error: Interaction not found.'));
    }
}

/**
 * Delete entire group.
 */
if (Program.group) {
    var existingGroupIndex = Manifest.getGroupIndex(Program.group);

    if (existingGroupIndex !== -1) {
        var group = Manifest.$data.groups[existingGroupIndex];

        Inquirer.prompt([
            {
                type: 'confirm',
                name: 'delete',
                message: function() {
                    console.log();
                    console.log(
                        Chalk.grey(
                            'Delete the "' + group.name + '" group and all it\'s interactions:'
                        )
                    );
                    console.log(
                        Chalk.grey(
                            '----------------------------------------------------------------'
                        )
                    );
                    return Chalk.red('Are you sure you want to delete this group?');
                },
                default: false
            }
        ]).then(function(answers) {
            if (!answers.delete) {
                console.log();
                console.log(
                    Chalk.grey('----------------------------------------------------------------')
                );
                console.log(Chalk.green('\u2713 Deletion cancelled.'));
                console.log(
                    Chalk.grey('----------------------------------------------------------------')
                );
                console.log();
                return;
            }

            if (answers.delete) {
                Manifest.$data.groups.splice(existingGroupIndex, 1);
                Manifest.deleteGroupFolder(group.name);

                Manifest.save({}, function() {
                    console.log();
                    console.log(
                        Chalk.grey(
                            '----------------------------------------------------------------'
                        )
                    );
                    console.log(Chalk.green('\u2713 Group and interaction deleted successfully.'));
                    console.log(
                        Chalk.grey(
                            '----------------------------------------------------------------'
                        )
                    );
                    console.log();
                });
            }
        });
    } else {
        console.log(Chalk.red('Error: Group not found.'));
    }
}
