#!/usr/bin/env node

'use strict';

const Command = require('commander').Command;
const Program = require('commander');
const Chalk = require('chalk');
const Inquirer = require('inquirer');
const Engine = require('./engine');
const Manifest = require('./manifest');

Manifest.init();

Program.usage('[group_name/interaction_name]')
    .description(Chalk.yellow('Create a new interaction.'))
    .option('-t, --type [name]', 'set interaction type: (sequence|flowchart). Default sequence.');

process.argv[1] = 'kobie new';

Program.parse(process.argv);

if (!process.argv.slice(2).length) {
    Program.outputHelp();
}

var group_name = Program.args[0];

if (!group_name) {
    process.exit();
}

if (!Manifest.validateInteraction(group_name)) {
    process.exit();
}

var parts = group_name.split('/');
var newInteraction = {
    group: parts[0],
    name: parts[1]
};

// Prompt for additional interaction details
Inquirer.prompt([
    {
        name: 'title',
        message: function() {
            console.log();
            console.log(Chalk.grey('New interaction details:'));
            console.log(Chalk.grey('----------------------------------------------------'));
            console.log(Chalk.grey('Interaction group: ' + parts[0]));
            console.log(Chalk.grey('Interaction name: ' + parts[1]));
            return 'Interaction title:';
        },
        validate: function(str) {
            return str !== '';
        }
    },
    {
        when: function() {
            return !Program.type;
        },
        type: 'list',
        name: 'width',
        message: function() {
            return 'Interaction width:';
        },
        choices: [
            {
                name: 'Full width',
                value: 'full'
            },
            {
                name: 'Half width',
                value: 'half'
            }
        ]
    }
]).then(function(answers) {
    newInteraction.title = answers.title;
    newInteraction.width = answers.width;
    newInteraction.type = Program.type || 'sequence';

    // If new group prompt for new group details
    if (!Manifest.groupExists(group_name)) {
        var newGroup = {};

        Inquirer.prompt([
            {
                name: 'title',
                message: function() {
                    console.log();
                    console.log(Chalk.grey('New group details:'));
                    console.log(Chalk.grey('----------------------------------------------------'));
                    console.log(Chalk.grey('Group name: ' + parts[0]));
                    return 'Group title:';
                },
                validate: function(str) {
                    return str !== '';
                }
            },
            {
                type: 'list',
                name: 'group_position',
                message: 'Select group position:',
                choices: Manifest.getGroupPositionChoices()
            }
        ]).then(function(answers) {
            newGroup.name = parts[0];
            newGroup.title = answers.title;

            Manifest.$data.groups.splice(answers.group_position, 0, newGroup);
            Manifest.$data.groups[answers.group_position].interactions = [newInteraction];
            if (Manifest.createInteractionFiles(newInteraction)) {
                Manifest.save({}, function() {
                    console.log();
                    console.log(Chalk.grey('----------------------------------------------------'));
                    console.log(Chalk.green('\u2713 Interaction data saved successfully.'));
                    console.log(Chalk.grey('----------------------------------------------------'));

                    console.log();
                    console.log(
                        Chalk.yellow(
                            'Add your group description to ' +
                                Manifest.$root +
                                '/interactions/' +
                                newInteraction.group +
                                '/description.md (Markdown supported)'
                        )
                    );
                    console.log(
                        Chalk.yellow(
                            'Add your interaction markup to ' +
                                Manifest.$root +
                                '/interactions/' +
                                newInteraction.group +
                                '/' +
                                newInteraction.name +
                                '/markup.html'
                        )
                    );
                    console.log(
                        Chalk.yellow(
                            'Add your interaction description to ' +
                                Manifest.$root +
                                '/interactions/' +
                                newInteraction.group +
                                '/' +
                                newInteraction.name +
                                '/description.md (Markdown supported)'
                        )
                    );
                    console.log();
                });
            }
        });
    } else {
        // Prompt to position new interaction in group
        Inquirer.prompt([
            {
                type: 'list',
                name: 'interaction_position',
                message: 'Select interaction position in the "' + newInteraction.group + '" group:',
                choices: Manifest.getInteractionPositionChoices(newInteraction.group),
                default: Manifest.getInteractionPositionChoices(newInteraction.group).length - 1
            }
        ]).then(function(answers) {
            var groupIndex = Manifest.getGroupIndex(newInteraction.group);

            Manifest.$data.groups[groupIndex].interactions.splice(
                answers.interaction_position,
                0,
                newInteraction
            );

            if (Manifest.createInteractionFiles(newInteraction)) {
                Manifest.save({}, function() {
                    console.log();
                    console.log(Chalk.grey('----------------------------------------------------'));
                    console.log(Chalk.green('\u2713 Interaction data saved successfully.'));
                    console.log(Chalk.grey('----------------------------------------------------'));

                    console.log();
                    console.log(
                        Chalk.yellow(
                            'Add your interaction markup to ' +
                                Manifest.$root +
                                '/interactions/' +
                                newInteraction.group +
                                '/' +
                                newInteraction.name +
                                '/markup.html'
                        )
                    );
                    console.log(
                        Chalk.yellow(
                            'Add your interaction description to ' +
                                Manifest.$root +
                                '/interactions/' +
                                newInteraction.group +
                                '/' +
                                newInteraction.name +
                                '/description.md (Markdown supported)'
                        )
                    );
                    console.log();
                });
            }
        });
    }
});
