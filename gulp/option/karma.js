/**
 * Configuration for Karma test-runner
 */
var path = require('path');
'use strict';

module.exports = {
  options: {
    kconfig: '/gulp/karma.conf.js',
    specs: [
    'src/**/*.spec.js',
    ],
    coverage: 'test/coverage/'
  },

  // Testing in all browsers
  all: {
    options: {
      // Start these browsers
     //browsers: ['ChromeHeadless', 'FirefoxHeadless', 'PhantomJS']
     browsers: ['ChromeHeadless', 'FirefoxHeadless']
    }
  },

  // Coverage Testing
  coverage: {
    options: {
        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'test/dist/*.js' : ['coverage']
        },
        coverageReporter: {
            includeAllSources: true,
            reporters: [
                //     {
                //         type : 'html',
                //         dir : path.join(__dirname, '../test/coverage/html')
                //     },
                //     {
                //         type : 'cobertura',
                //         dir: path.join(__dirname, '../test/coverage/')
                //     },
                //     {
                //         type: 'lcov',
                //         dir: path.join(__dirname, '../test/coverage/lcov')
                //     }
            ]
        },
        coverageIstanbulReporter: {
            // reports can be any that are listed here: https://github.com/istanbuljs/istanbuljs/tree/aae256fb8b9a3d19414dcf069c592e88712c32c6/packages/istanbul-reports/lib
            reports: ['html', 'lcovonly', 'text-summary'],

            // base output directory. If you include %browser% in the path it will be replaced with the karma browser name
            dir: path.join(__dirname, '../../test/coverage'),

            // Combines coverage information from multiple browsers into one report rather than outputting a report
            // for each browser.
            combineBrowserReports: true,

            // if using webpack and pre-loaders, work around webpack breaking the source path
            //fixWebpackSourcePaths: true,

            // Omit files with no statements, no functions and no branches from the report
            skipFilesWithNoCoverage: true,

            // Most reporters accept additional config options. You can pass these through the `report-config` option
            'report-config': {
                // all options available at:
                // https://github.com/istanbuljs/istanbuljs/blob/aae256fb8b9a3d19414dcf069c592e88712c32c6/packages/istanbul-reports/lib/html/index.js#L135-L137
                html: {
                    // outputs the report in ./coverage/html
                    subdir: 'html'
                }
            },
            // enforce percentage thresholds
            // anything under these percentages will cause karma to fail with an exit code of 1 if not running in watch mode
            thresholds: {
                emitWarning: false, // set to `true` to not fail the test command when thresholds are not met
                // thresholds for all files
                global: {
                    statements: 100,
                    lines: 100,
                    branches: 100,
                    functions: 100
                },
                // thresholds per file
                // each: {
                //     statements: 100,
                //     lines: 100,
                //     branches: 100,
                //     functions: 100,
                //     overrides: {
                //         // 'baz/component/**/*.js': {
                //         //     statements: 98
                //         // }
                //     }
                // }
            },
            verbose: false, // output config used by istanbul for debugging
            instrumentation: {
                // `instrumentation` is used to configure Istanbul API package.
                // To include `node_modules` code in the report.
                'default-excludes': false
            }
        },
    }
  },

  // Browsers
  unit: {
    options: {
      browsers: ['ChromeHeadless', 'FirefoxHeadless']
    }
  },

  // Travis
  travis: {
    options: {
      // Use Crhome, Firefox for Travis
      browsers: ['ChromeHeadless', 'FirefoxHeadless']
    }
  }
};
