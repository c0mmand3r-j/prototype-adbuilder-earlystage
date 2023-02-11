/*
 * An example es module
 * @author Author name
 */

// Public API
// export default function() {
module.exports = function() {
    // Strict mode to prevent sloppy JS
    'use strict';

    // Private variables
    let _event = {
        name: '_test',
        test: null,
    };

    return {
        // Getter for private variable
        //getEventName(key) {
        getEventName: function(key) {
            return _event[key];
        },

        // File an event on initialisation
        //init() {
        init: function() {
            //console.log(process.env.NODE_ENV);
            _event['test'] = '_test';
            return _event;
        }
    };
}
