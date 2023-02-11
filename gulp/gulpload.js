/**
 * Load Gulp configurations
 */
'use strict';

/**
 * Load configuration files for Gulp
 * @param  {string} path :: path to folder with tasks
 * @param  {string} ext :: filetype to load
 * @return {object} :: All options
 */
module.exports = function (path, ext) {
  let glob = require('glob');
  let object = {};
  let key;

  glob.sync('*', { cwd: path }).forEach(function (option) {
    if(option.indexOf('.' + ext) >= 0) {
      let reg = new RegExp('\.' + ext + '$');
      key = option.replace(reg, '');
      object[key] = require('../' + path + '/' + option);
    }
  });

  return object;
};
