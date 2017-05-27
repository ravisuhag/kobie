const webpack = require('webpack');

module.exports = {
    entry: './_template/app/js/main.js',
    output: {
        path: __dirname + '/_template/app/js',
        filename: 'main.min.js'
    },
    node: {
        fs: 'empty'
    }
};
