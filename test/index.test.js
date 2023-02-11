
// jshint camelcase: false
let AllErrorHandler = require("all-error-handler");
let env = require('./env.json');

// Include your specs here
//let ModuleSpec = require('../src/ibmad/@@IBM_PRODUCT/module.spec');
let ModuleSpec = require('./ibmad.test');
// import HtmlSpec from "../src/index.spec.js";
let HtmlSpec = require('../src/index.spec');

(function () {

  'use strict';

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
    let errorHandler = new AllErrorHandler(err => {
        console.log(`Error occured - ${err.toString()}`);
    });
    //throw new Error("Foo");
    // Make async
    window.__karma__.loaded = function () {};

    // Set the flag for test environment
    window.__test = true;

    // Execute new specs here
    new HtmlSpec();
    new ModuleSpec();

    window.__karma__.start();
}());
