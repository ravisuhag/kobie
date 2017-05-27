'use strict';

const Vue = require('vue/dist/vue');

var Kobie = new Vue({
    el: '[data-app=kobie]',
    data: {
        intro: null,
        project_logo: 'https://raw.githubusercontent.com/ravisuhag/kobie/master/mascot.png',
        project_favicon: null,
        project_name: null,
        project_url: null,
        theme: {
            border_color: null,
            highlight_color: null,
            brand_color: null,
            background_color: null,
            code_highlight_theme: null,
            override_code_highlight_bg: null,
            sample_dark_background: null,
            show_project_name: true,
            show_version: null,
            max_width: null,
            titles: {
                library_title: 'Optimus',
                pages_title: null,
                components_title: null
            }
        }
    }
});
