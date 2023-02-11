/**
 * Template for banner to add to file headers
 */
'use strict';

module.exports = {
    // env references
    STAGE: process.env.SOURCE + 'stage',
    PRODUCTION: process.env.PRODUCTION + 'dist',
    TEST: process.env.TEST,
};
