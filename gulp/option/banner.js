/**
 * Template for banner to add to file headers
 */
'use strict';
let pkg = require('../../package.json');
var config = require('../config' );

module.exports = {
    // env references
    STAGE:
        '/*!\n'+
        '***************************************************************' + '\n' +
        '*** <%= package.name %> v<%= package.version %>' + '\n'+
        '*** <%= package.description %>' + '\n'+
        '*** (c) ' + new Date().getFullYear() + ' <%= package.author.name %>' + '\n' +
        '*** <%= package.license %> License' + '\n'+
        '*** <%= package.repository.url %>' + '\n'+
        '***************************************************************' + '\n' +
        '*/\n\n'
    ,
    PRODUCTION:
        '/*!' +
        ' <%= package.name %> v<%= package.version %>' +
        ' | (c) ' + new Date().getFullYear() + ' <%= package.author.name %>' +
        ' | <%= package.license %> License' +
        ' | <%= package.repository.url %>' +
        ' */\n'
    ,

};
