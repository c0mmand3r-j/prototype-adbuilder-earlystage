/**
 * File ref replacing in build process
 */
'use strict';
let gconfig = require('../config');

module.exports = {
    // env references
    PRODUCTION: {
      maincss: gconfig.paths.css.dest + 'index.min.css',
      mainjs: gconfig.paths.js.dest + 'index.min.js'
    },

    STAGE: {
        maincss: gconfig.paths.css.dest + 'index.css',
        mainjs: gconfig.paths.js.dest + 'index.js'
    }
};
