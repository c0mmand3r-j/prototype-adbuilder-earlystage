/**
 * Gulp packages
 */

// General
let {gulp, src, dest, watch, series, parallel} = require('gulp');
let package = { package: require('./package.json')};
let argv = require('yargs').argv;
let gload = require('./gulp/gulpload');
let concat = require('gulp-concat');
let del = require('del');
let deepExtend = require('deep-extend');
let flatmap = require('gulp-flatmap');
let fs = require('fs');
let header = require('gulp-header');
let inject = require('gulp-inject');
let lazypipe = require('lazypipe');
let rename = require('gulp-rename');
let replace = require('gulp-replace');
let sourcemaps = require('gulp-sourcemaps');

let bro = require('gulp-bro');
let babelify = require('babelify');

// Scripts
let jshint = require('gulp-jshint');
let optimizejs = require('gulp-optimize-js');
let stylish = require('jshint-stylish');
let uglify = require('gulp-uglify');

// Styles
let sass = require('gulp-sass');
let postcss = require('gulp-postcss');
let prefix = require('autoprefixer');
let minify = require('cssnano');
let mqpacker = require('css-mqpacker');

// SVGs
let svgmin = require('gulp-svgmin');

// BrowserSync
let browserSync = require('browser-sync');

// Karma
let Server = require('karma').Server;
// let dotenv = require('dotenv').config({path: '../'});

require('events').EventEmitter.defaultMaxListeners = 15;
process.on('uncaughtException', err => {
    console.error('There was an uncaught error', err)
    process.exit(1) //mandatory (as per the Node.js docs)
})
let gconfig;
/**
 * Settings
 * Turn on/off build features
 */
let settings = {
	reload   : true,
	clean    : true,
	copy     : true,
	css      : true,
	js       : true,
	img      : true,
	svg      : true,
	lib      : true,
	html     : true,
	inject   : true,
	preview  : true,
	polyfills : true,
};

/**
 * Gulp Tasks
 */
// Repeated file build task
// Set the right environment
let setENV = function(done, env) {
    let _ENV = {};
    let _ibmad = {};
    if('ibmad' in argv) {
        _ENV.SOURCE = './src/';
		_ENV.IBM_PRODUCT = argv.ibmad.toLowerCase();
        _ENV.IBM_PATH    = _ENV.SOURCE + 'ibmad/' + _ENV.IBM_PRODUCT + '/';
		_ENV.IBM_ENV     = require(_ENV.IBM_PATH + 'data/env.ibm');
		for(let dataset in _ENV.IBM_ENV) {
			if(env == dataset) {
                _ENV.NODE_ENV   = env;
                _ENV.STAGE      = './src/';
                _ENV.TEST       = './test/';
                _ENV.PRODUCTION = 'www/' + _ENV.IBM_PRODUCT  + '/cl' + _ENV.IBM_ENV[dataset]['__TCL__'] + '-' + _ENV.IBM_ENV[dataset]['__VER__'] + '/';
                _ENV.CWD        = _ENV[dataset];
				for(let cnstant in _ENV) {
                    if(cnstant == 'IBM_ENV') {
                        for(let key in _ENV[cnstant][dataset]) {
                            if(key == '__DECOUPLE__' && env == 'STAGE') {
                                _ENV[cnstant][dataset][key] = 1; // true
                            }
                            process.env[key] = _ENV[cnstant][dataset][key];
                        }
                    } else {
                        process.env[cnstant] = _ENV[cnstant];
                    }
				}
			}
		}
        if(!_ENV.NODE_ENV) {
            console.warn('No ENV found, check data/ibm.env: "STAGE, PRODUCTION, and TEST"');
            done();
            process.exit(1);
        }
		_ibmad[_ENV.IBM_PRODUCT] = gload(_ENV.IBM_PATH + 'data', 'ibm');
	} else {
        console.warn('No product defined, add: --ibmad=MODULE');
        done();
        process.exit(1);
    }

    /**
	 * Configuration: All data from package.json, gulp/options and
	 * gulp/plugins
	 */
	gconfig = deepExtend(
		_ENV,
		package,
        _ibmad,
        require('./gulp/config'),
		gload('./gulp/option', 'js'),
		gload('./gulp/plugin', 'js'),
	);
	//console.log(gconfig);
	return;
};

// Remove pre-existing content from folders
let clearPath = function(done) {

	// Make sure this feature is activated before running
	if (!settings.clean) return done();

	// Clean the folder
	del.sync([
        gconfig.copy[[process.env.NODE_ENV]]
	]);

	// Signal completion
	return done();
};

// Repeated file build task
function makeFile(data) {
	let partials = [];
	if('index' in data){
		data['index'].buffer.map(function(obj) {
			partials.push(process.env.SOURCE + obj.file)
		});
	}
	return partials;
}

// Build master html file
let buildHTML = function(done) {

	// Make sure this feature is activated before running
	if (!settings.html) return done();

	// Copy static files
	return src(makeFile(gconfig[process.env.IBM_PRODUCT].html))
		.pipe(concat(gconfig.paths.html.main))
		.pipe(replaceThis())
		.pipe(dest(process.env.CWD))
};

// Repeated JavaScript task
function jsTasks() {
	switch(process.env.NODE_ENV){
		case('STAGE'):
			return lazypipe()
                .pipe(header, gconfig.banner[process.env.NODE_ENV], {package:gconfig.package})()
			break;
		case('PRODUCTION'):
			return lazypipe()
				.pipe(optimizejs)
				.pipe(uglify)
				.pipe(rename, {suffix:'.min'})()
                .pipe(header, gconfig.banner[process.env.NODE_ENV], {package:gconfig.package})
			break;
	}
}
// wrap js in one load function
let jsWrapper = function(done) {

    // Make sure this feature is activated before running
    if (!settings.js) return done();

	return src(makeFile(gconfig[process.env.IBM_PRODUCT].js))
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.mapSources(function(sourcePath, file) {
            let path = file.path.replace(__dirname + '/src', '');
            return (process.env.__DECOUPLE__ == true ? '..' : '..') + path.replace(path.split('/').pop(), sourcePath);
		}))
		.pipe(concat(gconfig.paths.js.main))
		.pipe(jsTasks())
        .pipe(process.env.NODE_ENV == 'STAGE' ? sourcemaps.write() : dest(process.env.CWD + gconfig.paths.js.dest))
        .pipe(dest(process.env.CWD + gconfig.paths.js.dest))
}

// lib js builder
let buildLibs = function(done) {

    // Make sure this feature is activated before running
    if (!settings.lib) return done();

	return src(makeFile(gconfig[process.env.IBM_PRODUCT].lib))
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.mapSources(function(sourcePath, file) {
            let path = file.path.replace(__dirname + '/src', '');
			return (process.env.__DECOUPLE__ == true ? '..' : '..') + path.replace(path.split('/').pop(), sourcePath);
		}))
		.pipe(concat(gconfig.paths.lib.main))
		.pipe(jsTasks())
        .pipe(process.env.NODE_ENV == 'STAGE' ? sourcemaps.write() : dest(process.env.CWD + gconfig.paths.lib.dest))
        .pipe(dest(process.env.CWD + gconfig.paths.lib.dest))
}

// Repeated JavaScript tasks
function scriptTasks(mvp) {
	switch(process.env.NODE_ENV) {
		case('STAGE'):
			return lazypipe()
				.pipe(optimizejs)
				.pipe(header, gconfig.banner[process.env.NODE_ENV], {package:gconfig.package})
				.pipe(sourcemaps.write)
				.pipe(dest, mvp || process.env.CWD + gconfig.paths.js.dest)()
			break;
		case('PRODUCTION'):
			return lazypipe()
				.pipe(rename, {suffix: '.min'})
				.pipe(uglify)
				.pipe(optimizejs)
				.pipe(header, gconfig.banner[process.env.NODE_ENV], {package:gconfig.package})
				.pipe(dest, mvp || process.env.CWD + gconfig.paths.js.dest)()
			break;
	}
}
// Lint, minify, and concatenate js
let buildScripts = function(done) {

	// Make sure this feature is activated before running
	if (!settings.js) return done();

	// Run tasks on script files
	return src(gconfig.paths.js.src)
		.pipe(flatmap(function(stream, file) {

			// If data push it
			if ('.' + file.basename.split('.').pop() == gconfig.paths.js.data) {
				//console.log((file.basename));
				return stream.pipe(dest(process.env.CWD + gconfig.paths.js.dest));
			}

			let mvp = null;
			// If the file is a directory
			if (file.isDirectory()) {
                mvp = file.path + '/';
                mvp = mvp.replace(process.env.SOURCE, process.env.CWD);
				// Setup a suffix letiable
				let suffix = '';
				// If separate polyfill files enabled
				if (settings.polyfills) {

					// Update the suffix
					suffix = '.polyfills';

					// Grab files that aren't polyfills, concatenate them, and process them
					src([file.path + '/*.js','!' + file.path + '/*' + gconfig.paths.js.polyfills])
                        .pipe(sourcemaps.init())
						.pipe(concat(file.relative + '.js'))
                        .pipe(uglify())
						.pipe(scriptTasks(mvp))
                    ;
				}

				// Grab all files and concatenate them
				// If separate polyfills enabled, this will have .polyfills in the filename
				src(file.path + '/*.js')
                    .pipe(sourcemaps.init())
					.pipe(concat(file.relative + suffix + '.js'))
					.pipe(scriptTasks(mvp))
                ;
				return stream;
			}
			// Otherwise, process the file
			return stream.pipe(scriptTasks(mvp));
		}))
};

// Lint js
let lintScripts = function(done) {

	// Make sure this feature is activated before running
	if (!settings.js) return done();

	// Lint js
	return src(makeFile(gconfig[process.env.IBM_PRODUCT].js).filter(function(str) {return !(RegExp('.ibx').test(str))}))
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
};

// path parsing
function parsePath(str) {
	let res = str;
	let rmap = {
		IBM_PRODUCT: process.env.IBM_PRODUCT,
		NODE_ENV: process.env.NODE_ENV,
	}
	Object.keys(rmap).map(function(key) {
		let needle = '@@' + key;
		let thread = rmap[key];
		let reg    = new RegExp(needle, "gi");
		res = res.replace(reg, thread);
	})
	return res;
}

// Repeated CSS tasks
function cssTasks() {
	switch(process.env.NODE_ENV){
		case('STAGE'):
			return lazypipe()
				.pipe(postcss, [
                    mqpacker({
                        sort: true
                    }),
                    prefix({
						cascade: true,
						remove: true,
					})
				])()
			break;
		case('PRODUCTION'):
			return lazypipe()
				.pipe(postcss, [
                    mqpacker({
                        sort: true
					}),
					prefix({
						cascade: true,
						remove: true,
					}),
					minify({
						discardComments: {
							removeAll: true
						}
					})
				])
                .pipe(rename, {suffix: '.min'})()
			break;
	}
}
// Process, lint, and minify Sass files
let buildStyles = function(done) {

	// Make sure this feature is activated before running
	if (!settings.css) return done();

	// Run tasks on all Sass files
	return src(makeFile(gconfig[process.env.IBM_PRODUCT].css))
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.mapSources(function(sourcePath, file) {
            let path = file.path.replace(__dirname + '/src', '')
            //console.warn(path.replace(path.split('/').pop(), sourcePath));
            return (process.env.__DECOUPLE__ == true ? '..' : '..') + path.replace(path.split('/').pop(), sourcePath);
		}))
		.pipe(concat(gconfig.paths.css.main))
        .pipe(header(gconfig.banner[process.env.NODE_ENV], {package:gconfig.package}))
		.pipe(sass({
			outputStyle: 'expanded',
		}))
		.pipe(cssTasks())
        .pipe(process.env.NODE_ENV == 'STAGE' ? sourcemaps.write() : dest(process.env.CWD + gconfig.paths.css.dest))
		.pipe(dest(process.env.CWD + gconfig.paths.css.dest));
};

// Optimize SVG files
let buildSVGs = function(done) {

	// Make sure this feature is activated before running
	if (!settings.svg) return done();

	// Optimize SVG files
	return src(gconfig.paths.svg.src)
		.pipe(svgmin())
		.pipe(dest(process.env.CWD + gconfig.paths.svg.dest));
};

// Grab IMG files
let buildIMGs = function(done) {

	// Make sure this feature is activated before running
	if (!settings.img) return done();

    // Copy IMG files
	return src(parsePath(gconfig.paths.img.src))
		.pipe(dest(process.env.CWD + gconfig.paths.img.dest));
};

// Copy static files into staging folder
let copyFiles = function(done) {

	// Make sure this feature is activated before running
	if (!settings.copy) return done();

    // Copy static files
	return src(gconfig.paths.copy.src)
		.pipe(dest(gconfig.copy[process.env.NODE_ENV]));
};

// Copy static files into staging folder
let copyPreview = function(done) {

	// Make sure this feature is activated before running
	if (!settings.preview) return done();

    // Copy static files
	return src(gconfig.paths.preview.src)
		.pipe(dest(process.env.CWD + gconfig.paths.preview.dest));
};

// Repeated replace task
function replaceThis() {
	return lazypipe()
		.pipe(flatmap, function(stream, file) {
			//console.log(file.basename);
			Object.keys(gconfig.replace[process.env.NODE_ENV]).map(function(key) {
				let needle = '@@' + key;
				let thread = gconfig.replace[process.env.NODE_ENV][key];
				let reg    = new RegExp(needle, "gi");
				// If the file is a directory
				if (file.isDirectory()) {
					// Grab all files and replace
					src(file.path + '/*')
						.pipe(replaceThis())
					;
					console.log('DIR');
					return stream;
				}
				// Replace foobaz with barbaz and log a ton of information
				// See http://mdn.io/string.replace#Specifying_a_function_as_a_parameter
				return stream.pipe(
					replace(reg, function(match) {
						//console.log('Found ' + match);
						return thread;
					}))
				})
			return stream
		})()
}

// Cachebust
let cacheBustTask = function() {
	let needle = 'cb=';
	let thread = new Date().getTime();
	let reg = '/' + needle + '\\d+/g';
    //return src(['dist/*.{.html, .js, .css, .png, .jpg}'])
    return src([process.env.CWD + '*'])
        .pipe(replace(reg, function(match, p1, offset, string) {
			// Replace foobaz with barbaz and log a ton of information
			// See http://mdn.io/string.replace#Specifying_a_function_as_a_parameter
			 console.log('Found ' + match + ' with param ' + p1 + ' at ' + offset + ' inside of ' + string);
			return needle + thread;
    	}))
        .pipe(dest(process.env.CWD));
}

// inject helper
function getContent(file) {
    return file.contents.toString('utf8')
}
// Repeated inject tasks
function injectPipe() {
    return lazypipe()
    .pipe(inject, src([process.env.CWD + gconfig.inject[process.env.NODE_ENV].maincss]), {
        starttag: '/*-- inject:css --*/',
        endtag  : '/*-- endinject --*/',
        transform: function(filePath, file) { return getContent(file)}
    })
    .pipe(inject, src([process.env.CWD + gconfig.inject[process.env.NODE_ENV].mainjs]), {
        starttag: '/*-- inject:js --*/',
        endtag  : '/*-- endinject --*/',
        transform: function(filePath, file) { return getContent(file)}
    })()
}
// File injection
let injectTask = function(done) {

	// Make sure this feature is activated before running
	if (!settings.inject) return done();

    return src([process.env.CWD + gconfig.paths.html.main])
		.pipe(inject(src([process.env.IBM_PATH + '/module.ibx']), {
			starttag: '/*-- inject:ibmad:ibx --*/',
			endtag  : '/*-- endinject --*/',
            transform: function(filePath, file) { return getContent(file)}
        }))
		.pipe(inject(src([process.env.SOURCE + 'template/macro/_' + process.env.__AD_PLATFORM__ + '.ibx']), {
			starttag: '/*-- inject:macro:ibx --*/',
			endtag  : '/*-- endinject --*/',
            transform: function(filePath, file) { return getContent(file)}
        }))
        .pipe(process.env.__DECOUPLE__ == true ? dest(process.env.CWD) : injectPipe())
        .pipe(dest(process.env.CWD));
}

// Watch for changes to the src directory
let startServer = function(done) {

    // Make sure this feature is activated before running
    if (!settings.reload) return done();

    // Initialize BrowserSync
    browserSync.init({
        ui: {
            port: 8080
        },
        server: {
            baseDir: gconfig.paths.reload,
        },
        port: 8888,
    });

    // Signal completion
    done();
};

// Reload the browser when files change
let reloadBrowser = function(done) {

    if (!settings.reload) return done();

    browserSync.reload();
    done();
};

// Watch for changes
let watchSource = function(done) {
    let sources = []
    for(let obj in gconfig.paths) {
        //console.warn(gconfig.paths[obj]);
        if(typeof gconfig.paths[obj] == 'object' && ('src' in gconfig.paths[obj])){
            sources.push(gconfig.paths[obj]['src']);
        }
    }
    watch(sources, series(exports.STAGE, reloadBrowser));
    done();
};

// Run karma tests
let setShim = function() {
    fs.writeFileSync('./test/env.json', JSON.stringify(process.env));
    return src(['test/ibmad.test.js'])
        .pipe(inject(src([process.env.SOURCE + 'ibmad/' + process.env.IBM_PRODUCT + '/module.spec.js']), {
            starttag: '/*-- inject:module --*/',
            endtag  : '/*-- endinject --*/',
            transform: function(filePath, file) { return getContent(file)}
        }))
        .pipe(dest('./test'))
   // done();
};

// Run karma tests
let setTest = function(done) {
    return src([gconfig.paths.test.entry])
        .pipe(bro({
            transform: [
                babelify.configure({ presets: ['@babel/preset-env'] }),
            ],
        }))
        .pipe(rename('test.js'))
        .pipe(dest(gconfig.paths.test.dest))
    //done();
};

// Run karma tests
let runTest = function(done) {
    new Server({
        configFile: __dirname + gconfig.karma.options.kconfig,
        browsers: gconfig.karma.all.options.browsers,
        reporters: ['mocha','karmaHTML'],
    }, function(exitCode) {
        magicBeans();
        console.log('Karma has exited with ' + exitCode)
        done();
        process.exit(exitCode)
    }).start();
};

// Run karma coverage tests
let runCoverage = function(done) {
    new Server(deepExtend({},{
        configFile: __dirname + gconfig.karma.options.kconfig,
        browsers: gconfig.karma.all.options.browsers,
        reporters: ['karmaHTML','coverage','coverage-istanbul'],
    },gconfig.karma.coverage.options), function(exitCode) {
        magicBeans();
        console.log('Karma has exited with ' + exitCode)
        done();
        process.exit(exitCode)
    }).start();
};

function magicBeans(){
    console.log('\n' + '|\\   /|' + '\n' + ' \\1_|/'  + '\n' + ' /@  \\'  + '\n' + ' 7___/'  + '\n' + ' |>o<|'   + '\n');
}

/**
 * Export Tasks
 */

// gulp
// Default task
exports.default = function(done) {
    setENV(done, 'PRODUCTION');
    return series(
        clearPath,
        parallel(
            copyFiles,
            buildHTML,
            buildStyles,
            buildLibs,
            buildIMGs,
            buildSVGs,
            lintScripts,
            jsWrapper,
        ),
        injectTask,
        cacheBustTask,
        runTest,
    )(done);
}

// gulp STAGE
// Builds dev environment
exports.STAGE = function(done) {
	setENV(done, 'STAGE');
	return series(
        clearPath,
		parallel(
			copyFiles,
            copyPreview,
			buildHTML,
			buildStyles,
            buildLibs,
			buildIMGs,
			buildSVGs,
			lintScripts,
			jsWrapper,
		),
		injectTask
	)(done);
};

// gulp watch
// Watch and reload
exports.WATCH = series(
	exports.STAGE,
	startServer,
	watchSource
);

// Test task
// Run Karma tests, allows for TDD!
exports.TEST = function(done) {
    setENV(done, 'STAGE');
    return series(
        setShim,
        setTest,
        runTest,
    )(done);
};
// Test task
// Run Karma tests, allows for TDD!
exports.COVERAGE = function(done) {
    setENV(done, 'STAGE');
    return series(
        setShim,
        setTest,
        runCoverage,
    )(done);
};
