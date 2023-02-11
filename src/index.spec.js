/**
 * An example specification for the example module
 * Loads the module and runs the test suite
 * Module path is relative to the current path
 */
//import DOMCustomMatchers from "../node_modules/karma-jasmine-dom/index";
let DOMCustomMatchers = require('karma-jasmine-dom');

// export default function () {
module.exports = function() {

    'use strict';

    describe("IBMAD", function() {

        beforeAll(function(done) {
            //load DOM custom matchers from karma-jasmine-dom package
            //let matches = require('karma-jasmine-dom')DOMCustomMatchers();

            jasmine.addMatchers(DOMCustomMatchers);

            //lets open our 'index.html' file in the browser by 'index' tag as you specified in 'karma.conf.js'
            karmaHTML.index.open();

            //karmaHTML.index.onstatechange fires when the Document is loaded
            //now the tests can be executed on the DOM
            karmaHTML.index.onstatechange = function(ready) {
                //if the #Document is ready, fire tests
                //the done() callback is the jasmine native async-support function
                if(ready) done();
            };
        });

        it("should be a real Document object", function(done) {
            var _document = karmaHTML.index.document;
            expect(_document.constructor.name).toEqual('www');
            done();
        });

        it("should be a real DOM", function(done) {
            var _document = karmaHTML.index.document;
            expect(_document.constructor.name).toEqual('HTMLDocument');
            done();
        });

        afterAll(function(done) {
            setTimeout(function() {
                karmaHTML.index.close();
                done();
            },0);
        });

    });
};
