'use strict';

const IsWindows = require('is-windows');

module.exports = {
    pathify: function(path) {
        if (IsWindows()) {
            return path.replace(/(\/)/g, '\\');
        }
        return path;
    },

    merge: function(source, target) {
        target = target ? target : {};
        for (var key in target) {
            if (source.hasOwnProperty(key)) {
                source[key] = target[key];
            }
        }
        return source;
    }
};
