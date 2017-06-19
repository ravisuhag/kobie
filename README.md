# Kobie 

<img align="right" width="300" src="mascot.png">


> A lightweight library for software architecture modelling

A kobie architecture repository comprises of interactions organised into groups. Each interaction has a markup.html and description.md file which are used to render an example of the interaction. A group can also have an description and is used for organisational purposes. You also have the option to add pages of content, for example an introduction page and/or coding guidelines specific to your project.


## Getting Started

Firstly globally install Kobie:

`npm install -g kobie`

Then from within your project root initialise kobie e.g.:

`kobie init` 

Finally add your first interaction e.g.:

`kobie new user/create`

Your architecture repository should now be up and running though granted it will look a little sparse at this stage.


## Adding Interactions

The simplest way to add an interaction to your repository is by using the Kobie command-line tool which will ask you a series of questions on what type of interaction you want. For example:

`kobie new reservation/expire`

This result of this in your data.json file would be:

```
"groups": [
    {
        "name": "reservation",
        "title": "Reservation",
        "interactions": [
            {
                "group": "reservation",
                "name": "expire",
                "title": "Reservation expiry flow"
            }
        ]
    }
],
```

The necessary files required for the new interaction are created for you automatically so now you can add your markup and a interaction description ready to be displayed in your repository.

## List interactions

To see a list of all of the interactions in your repository, you can use the list command:

`kobie list`


## Acknowledgements

Kobie is heavily inspired from Astrum. 

Kobie's UI is built with Vue.js. Kobie's command-line tool is built using Commander by TJ Holowaychuk and Inquirer by Simon Boudrias.

## License

The code is available under the MIT license.