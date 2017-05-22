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
        for (var key in source) {
            if (!target.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
        return source;
    }
};
