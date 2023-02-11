/**
 * File ref replacing in build process
 */

'use strict';
let gconfig = require('../config' );
let deepExtend = require('deep-extend');

// MAIN AD PROPERETIES
let IBM_ENV = require('../.' + process.env.IBM_PATH + 'data/env.ibm');

module.exports = {
    // env references
    STAGE: deepExtend({}, IBM_ENV['STAGE'],
        {
            cssstart: '<style>',
            cssend  : '</style>',
            jsstart : '<script>',
            jsend   : '</script>',
            libmain : '/' + gconfig.paths.lib.dest + '/lib.js',
            cssmain : process.env.__DECOUPLE__ == true
                ? "@import url('/stage/index.css');"
                : ''
            ,
            jsmain : process.env.__DECOUPLE__ == true
                ? '<script src="/stage/index.js"></script>'
                : ''
            ,
        }
    ),
    PRODUCTION: deepExtend({}, IBM_ENV['PRODUCTION'],
        {
            cssstart: '<style>',
            cssend  : '</style>',
            jsstart : '<script>',
            jsend   : '</script>',
            libmain : '/' + process.env.__ROOT__ + process.env.__DIR__ + process.env.__VER__  + '/lib.min.js',
            cssmain : process.env.__DECOUPLE__ == true
                ? "@import url('/" + process.env.__ROOT__ + process.env.__DIR__ + process.env.__VER__ + "/index.min.css');"
                : ''
            ,
            jsmain : process.env.__DECOUPLE__ == true
                ? '<script src="/'+ process.env.__ROOT__ + process.env.__DIR__ + process.env.__VER__ + '/index.min.js"></script>'
                : ''
            ,
        },
    ),
};
