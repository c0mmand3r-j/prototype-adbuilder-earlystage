/**
 * Default configuration for Karma
 */
'use strict';

// Get configuration of project to get correct files to include

var gconfig = require('./config');
process.env.CHROME_BIN = require('puppeteer').executablePath()

/**
 * Get all files to include in Karma tests
 * @return {Array} Array of all files to include
 */
var getIncludeFiles = function () {
  var files = [];

  // Add JavaScript lib
  var filePatterns = [];
  filePatterns.push('src/stage/index.js');
  filePatterns.push('src/stage/index.css');
  filePatterns.push('src/stage/lib.js');

  // Iterate through files
  filePatterns.forEach(function (element) {
    files.push({
      pattern: element,
      included: true
    });
  });

    // Add tests
    files.push({pattern: gconfig.paths.test.dest + '/*.js', included:true });

  return files;
};

/**
 * Exports as Karma configuration
 */
module.exports = function(config) {
    config.set({
        basePath: '../',

        // Determine the baseUrl if we are in Karma or not.
        //baseUrl: window.__karma__ ? "base/app" : "../",

        singleRun: true,
        colors: true,
        captureTimeout: 8000,
        hostname: '0.0.0.0',
        proxies: {
            '/stage/': '/base/src/stage/',
        },
        frameworks: ['jasmine-dom','jasmine',],
        client: {
            //If false, Karma will not remove iframes upon the completion of running the tests
            clearContext: true,
            captureConsole: true,
            //karma-html configuration
            karmaHTML: {
                source: [
                    //indicate 'index.html' file that will be loaded in the browser
                    //the 'index' tag will be used to get the access to the Document object of 'index.html'
                    {src:'./src/index.html', tag:'index'}
                ],
                auto: true,
                // width: "730px",
                // height: "30vw",
            }
        },
        plugins: [
            'events',
            'event-emitter',
            'karma-html',
            'karma-html2js-preprocessor',
            'karma-coverage-istanbul-reporter',
            'karma-mocha-reporter',
            'babel-plugin-istanbul',
            'all-error-handler',
            'karma-coverage',
            'karma-jasmine',
            'karma-jasmine-dom',
            'karma-ie-launcher',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-safari-applescript-launcher',
            'karma-phantomjs-launcher'
        ],
        customLaunchers: {
            FirefoxHeadless: {
                base: 'FirefoxDeveloper',
                flags: [ '-headless' ],
            }
        },

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_ERROR,

        // List of files to load in the browser
        files: getIncludeFiles()
    });
};

