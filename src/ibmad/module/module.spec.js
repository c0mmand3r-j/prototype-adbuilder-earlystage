/**
 * An example specification for the example module
 * Loads the module and runs the test suite
 * Module path is relative to the current path
 */
// import Module from './module.js';
// let Module = require('./module.js');
let Module = require('../src/ibmad/module/module.js');

// export default function() {
module.exports = function () {
    'use strict';

    var module = new Module();
    // Test suite INIT
    describe('INIT', function () {

        it('is available', function () {
            expect(module).not.toBe(null);
        });

        it('has getter for event name', function () {
            expect(module.getEventName('name')).toBe('_testx');
        });

        it('fires event on init', function () {
            var eventCalled;
            eventCalled = module.init();
            expect(eventCalled['test']).toBeTruthy();
        });

        afterAll(function(done) {
        done();
        });
    });
}
