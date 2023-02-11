(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (process){
(function(){var e=this,n=e.AllErrorHandler;class t{constructor(e,n=!0){if(!e)throw new Error("Missing callback function");this._callback=e,n&&this.startListening()}startListening(){this._listening=!0,"undefined"!=typeof window?window.addEventListener("error",this._callback):process.prependListener("uncaughtException",this._callback)}stopListening(){this._listening=!1,"undefined"!=typeof window?window.removeEventListener("error",this._callback):process.removeListener("uncaughtException",this._callback)}noConflict(){return e.AllErrorHandler=n,t}dispose(){this._listening&&this.stopListening(),this._callback=null}}"function"==typeof define&&define.amd?define([],function(){return e.AllErrorHandler=t}):"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=t),exports.AllErrorHandler=t):e.AllErrorHandler=t}).call("undefined"!=typeof self?self:this);
}).call(this,require('_process'))
},{"_process":2}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
const path = require('path');

var createPattern = function (pattern) {
  return {pattern: pattern, included: true, served: true, watched: false};
};

var initDomMatchers = function (files) {
  var matchersPath = path.dirname(require.resolve('jasmine-dom-custom-matchers'));
  files.unshift(createPattern(path.join(matchersPath,'/dom-matchers.js')));
};

initDomMatchers.$inject = ['config.files'];

module.exports = {
  'framework:jasmine-dom': ['factory', initDomMatchers]
};
},{"path":4}],4:[function(require,module,exports){
(function (process){
// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":2}],5:[function(require,module,exports){
"use strict";

/*
 * An example es module
 * @author Author name
 */
// Public API
// export default function() {
module.exports = function () {
  // Strict mode to prevent sloppy JS
  'use strict'; // Private variables

  var _event = {
    name: '_test',
    test: null
  };
  return {
    // Getter for private variable
    //getEventName(key) {
    getEventName: function getEventName(key) {
      return _event[key];
    },
    // File an event on initialisation
    //init() {
    init: function init() {
      //console.log(process.env.NODE_ENV);
      _event['test'] = '_test';
      return _event;
    }
  };
};

},{}],6:[function(require,module,exports){
"use strict";

/**
 * An example specification for the example module
 * Loads the module and runs the test suite
 * Module path is relative to the current path
 */
//import DOMCustomMatchers from "../node_modules/karma-jasmine-dom/index";
var DOMCustomMatchers = require('karma-jasmine-dom'); // export default function () {


module.exports = function () {
  'use strict';

  describe("IBMAD", function () {
    beforeAll(function (done) {
      //load DOM custom matchers from karma-jasmine-dom package
      //let matches = require('karma-jasmine-dom')DOMCustomMatchers();
      jasmine.addMatchers(DOMCustomMatchers); //lets open our 'index.html' file in the browser by 'index' tag as you specified in 'karma.conf.js'

      karmaHTML.index.open(); //karmaHTML.index.onstatechange fires when the Document is loaded
      //now the tests can be executed on the DOM

      karmaHTML.index.onstatechange = function (ready) {
        //if the #Document is ready, fire tests
        //the done() callback is the jasmine native async-support function
        if (ready) done();
      };
    });
    it("should be a real Document object", function (done) {
      var _document = karmaHTML.index.document;
      expect(_document.constructor.name).toEqual('www');
      done();
    });
    it("should be a real DOM", function (done) {
      var _document = karmaHTML.index.document;
      expect(_document.constructor.name).toEqual('HTMLDocument');
      done();
    });
    afterAll(function (done) {
      setTimeout(function () {
        karmaHTML.index.close();
        done();
      }, 0);
    });
  });
};

},{"karma-jasmine-dom":3}],7:[function(require,module,exports){
module.exports={"NODENV_SHELL":"bash","NODENV_DIR":"/Users/tommy.ugan@ibm.com/Desktop/PROJECTS/DEV/gulp-boilerplate-master/node_modules/gulp/bin","FIREFOX_BIN":"/Applications/Firefox Developer Edition.app/Contents/MacOS/firefox-bin","SHELL":"/bin/bash","TMPDIR":"/var/folders/b5/c9v8ptkn7dsf913zf8s880b00000gn/T/","Apple_PubSub_Socket_Render":"/private/tmp/com.apple.launchd.b2uBLPjsIy/Render","NODENV_ROOT":"/Users/tommy.ugan@ibm.com/.nodenv","NODENV_HOOK_PATH":"/Users/tommy.ugan@ibm.com/.nodenv/nodenv.d:/usr/local/Cellar/nodenv/1.3.1/nodenv.d:/usr/local/etc/nodenv.d:/etc/nodenv.d:/usr/lib/nodenv/hooks","USER":"tommy.ugan@ibm.com","COMMAND_MODE":"unix2003","SSH_AUTH_SOCK":"/private/tmp/com.apple.launchd.38jn5ni5Fq/Listeners","__CF_USER_TEXT_ENCODING":"0x1F5:0x0:0x0","PATH":"/Users/tommy.ugan@ibm.com/.nodenv/versions/13.7.0/bin:/usr/local/Cellar/nodenv/1.3.1/libexec:/Users/tommy.ugan@ibm.com/.rbenv/shims:/Users/tommy.ugan@ibm.com/.rbenv/bin:/Users/tommy.ugan@ibm.com/.nodenv/shims:/Users/tommy.ugan@ibm.com/.nodenv/bin:/usr/local/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/X11/bin","FIREFOX_DEVELOPER_BIN":"/Applications/Firefox Developer Edition.app/Contents/MacOS/firefox-bin","VERSIONER_PYTHON_VERSION":"2.7","PWD":"/Users/tommy.ugan@ibm.com/Desktop/PROJECTS/DEV/gulp-boilerplate-master","XPC_FLAGS":"0x0","RBENV_SHELL":"bash","XPC_SERVICE_NAME":"com.jetbrains.intellij-EAP.9360","SHLVL":"0","HOME":"/Users/tommy.ugan@ibm.com","LOGNAME":"tommy.ugan@ibm.com","NODENV_VERSION":"13.7.0","LC_CTYPE":"en_US.UTF-8","VERSIONER_PYTHON_PREFER_32_BIT":"no","DISPLAY":"/private/tmp/com.apple.launchd.OYyfXbQbgB/org.macosforge.xquartz:0","SECURITYSESSIONID":"186a8","INIT_CWD":"/Users/tommy.ugan@ibm.com/Desktop/PROJECTS/DEV/gulp-boilerplate-master","SOURCE":"./src/","IBM_PRODUCT":"module","IBM_PATH":"./src/ibmad/module/","__TCL__":"1337","__AD_PLATFORM__":"ADFORM","__DECOUPLE__":"1","__VER__":"1.0.0","__ENV__":"LOCALHOST","__ROOT__":"./","__DIR__":"","NODE_ENV":"STAGE","STAGE":"./src/","TEST":"./test/","PRODUCTION":"www/module/cl1337-1.0.0/","CWD":"./src/"}
},{}],8:[function(require,module,exports){
"use strict";

/*-- inject:module --*/

/**
 * An example specification for the example module
 * Loads the module and runs the test suite
 * Module path is relative to the current path
 */
// import Module from './module.js';
// let Module = require('./module.js');
var Module = require('../src/ibmad/module/module.js'); // export default function() {


module.exports = function () {
  'use strict';

  var module = new Module(); // Test suite INIT

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
    afterAll(function (done) {
      done();
    });
  });
};
/*-- endinject --*/

},{"../src/ibmad/module/module.js":5}],9:[function(require,module,exports){
"use strict";

// jshint camelcase: false
var AllErrorHandler = require("all-error-handler");

var env = require('./env.json'); // Include your specs here
//let ModuleSpec = require('../src/ibmad/@@IBM_PRODUCT/module.spec');


var ModuleSpec = require('./ibmad.test'); // import HtmlSpec from "../src/index.spec.js";


var HtmlSpec = require('../src/index.spec');

(function () {
  'use strict';

  jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
  var errorHandler = new AllErrorHandler(function (err) {
    console.log("Error occured - ".concat(err.toString()));
  }); //throw new Error("Foo");
  // Make async

  window.__karma__.loaded = function () {}; // Set the flag for test environment


  window.__test = true; // Execute new specs here

  new HtmlSpec();
  new ModuleSpec();

  window.__karma__.start();
})();

},{"../src/index.spec":6,"./env.json":7,"./ibmad.test":8,"all-error-handler":1}]},{},[9]);
