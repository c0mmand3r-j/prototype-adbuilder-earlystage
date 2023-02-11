# CreativeTech-AD-Builder

A boilerplate for building CreativeTech projects with [Gulp](https://gulpjs.com/). Uses Gulp 4.x. (This is a prototype)

**Features**

- Concatenate, minify, and lint JavaScript.
- Compile, minify, autoprefix, and lint Sass.
- Optimize SVGs.
- Copy static files and folders into your `ENV` directory.
- Automatically add headers and project details to JS and CSS files.
- Create polyfilled and non-polyfilled versions of JS files.
- Watch for file changes, and automatically recompile build and reload webpages.

**Gulp Boilerplate makes it easy to turn features on and off**, so you can reuse it for all of your projects without having to delete or modify tasks.



## Getting Started

### Dependencies

*__Note:__ if you've previously installed Gulp globally, run `npm rm --global gulp` to remove it. [Details here.](https://medium.com/gulpjs/gulp-sips-command-line-interface-e53411d4467)*

Make sure these are installed first.

- [Node.js](http://nodejs.org)
- [Gulp Command Line Utility](http://gulpjs.com) `npm install --global gulp-cli`

### Quick Start

1. In bash/terminal/command line, `cd` into your project directory.
2. Run `npm install` to install required files and dependencies.
3. When it's done installing, run one of the task runners to get going:
	- `gulp --ibmad=MODULE` manually compiles ibmad files.
	- `gulp STAGE --ibmad=MODULE` manually compiles dev files.
	- `gulp watch --ibmad=MODULE` automatically compiles files and applies changes using [BrowserSync](https://browsersync.io/) when you make changes to your source files and stages them.

**Try it out.** After installing, run `gulp --ibmad=MODULE` to compile some test files into the `www` directory. Or, run `gulp watch --ibmad=MODULE` and make some changes to see them recompile automatically.

## Documentation

Add your source files to the appropriate `src` subdirectories. Gulp will process and and compile them into `stage` and `www`.

- JavaScript partial files in `src/js` directory will be compiled to `ENV/js/index.js`. Files in `src/ibmad/MODULE/data` with the `.ibm` file type will be built and concatenated. For example, files listed in `src/ibmad/MODULE/data/js.ibm` will compile into `ENV/js/index.js`.
- CSS partial files in `src/sass` directory will be compiled to `ENV/css/index.css`.
- SVG files placed in the `src/svg` directory will be optimized with SVGO and compiled into `svg/`.
- Files and folders placed in the `copy` directory will be copied as-is into the `ENV` directory.

### package.json

The `package.json` file holds all of the details about your project.

Some information is automatically pulled in from it and added to a header that's injected into the top of your JavaScript and CSS files.

```json
{
	"name": "project-name",
	"version": "0.0.1",
	"description": "A description for your project.",
	"main": "./dist/your-main-js-file.js",
	"author": {
		"name": "YOUR NAME",
		"url": "http://link-to-your-website.com"
	},
	"license": "MIT",
	"repository": {
		"type": "git",
		"url": "http://link-to-your-git-repo.com"
	},
	"devDependencies": {}
}
```

*__Note:__ `devDependencies` are the dependencies Gulp uses. Don't change these or you'll break things. If any of the other fields are removed, make sure to remove reference to them in the Header (under `banner` in the `gconfig`) or `gulp watch` won't run.*

### env.ibm

The `env.ibm` file in `src/ibmad/MODULE/data` holds all of the details about your ad.

Some information is automatically pulled in from it and added to the ad, or for the build process.

```js
// MAIN AD PROPERETIES
let __AD__ = {
    __TCL__: 1337,
    __AD_PLATFORM__: "ADFORM",
    __DECOUPLE__: 1,
    __VER__: '1.0.0',
}
module.exports = {
    STAGE: deepExtend({}, __AD__,
        {
            __ENV__  : "LOCALHOST",
            __ROOT__ : "./",
            __DIR__  : "",
        }),
    PRODUCTION: deepExtend({}, __AD__,
        {
            __ENV__  : "SERVER",
            __ROOT__ : "https://{BUCKET}/cl/",
            __DIR__  : "watsonads/rav4-decouple/assets/",
        }),
    TEST: deepExtend({}, __AD__,
        {
            __ENV__  : "LOCALHOST",
            __ROOT__ : "./",
            __DIR__  : "",
        }),
}
```

*__Note:__ `devDependencies` are the dependencies Gulp uses. Don't change these or you'll break things. If any of the other fields are removed, make sure to remove reference to them in the Header (under `banner` in the `gconfig`) or `gulp watch` won't run.*

### Build Files (.ibm)
Files are in the `src/ibmad/MODULE/data` directory for every ad in the `ibmad` directory.

### Template Files (.ibx)
Files used to build ads located in the `src` directory.

```js
module.exports = {
    index: {
        buffer: [
            {
                file: "template/html/_header.ibx"
            },
            {
                file: "template/html/_main.ibx"
            },
            {
                file: "ibmad/" + process.env.IBM_PRODUCT + "/module.html"
            },
            {
                file: "template/html/_ibmad.ibx"
            },
            {
                file: "template/html/_footer.ibx"
            }
        ]
    }
}
```

### JavaScript

Put your JavaScript files in the `src/js` directory.

Files placed directly in the `js` folder will compile directly to `index.js` as both minified and unminified files. Files placed in subdirectories under `src/js` will also be concatenated into a single file. For example, files in `js/detects` will compile into `index.js`.

*__A note about polyfills:__ In subdirectories that contain files with the `.polyfill.js` suffix (for example, `matches.polyfill.js`), two versions can be created: one with the polyfill files, and one without.*

### Sass

Put your [Sass](https://sass-lang.com/) files in the `src/sass` directory.

Gulp generates minified and unminified CSS files. It also includes [autoprefixer](https://github.com/postcss/autoprefixer), which adds vendor prefixes for you.

### SVGs

Place SVG files in the `src/svg` directory.

SVG files will be optimized with [SVGO](https://github.com/svg/svgo) and compiled into `ENV/svg`.

### Copy Files

Files and folders placed in the `src/copy` directory will be copied as-is into `ENV`.

This is a great place to put HTML files, images, and pre-compiled assets.



## Options & Settings

Gulp Boilerplate makes it easy to customize for projects without having to delete or modify tasks.

Options and settings are located at the top of the `gulpfile.js`.

### Settings

Set features under the `settings` variable to `true` to turn them on (default), and `false` to turn them off.

```js
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
	html     : true,
	lib     : true,
	inject   : true,
    preview  : true,
	polyfills : true,
};
```

### Paths

Adjust the `input` and `output` paths for all of the Gulp tasks under the `paths` variable. Paths are relative to the root project folder.

```js
module.exports = {
  /**
   * Paths to project folders
   */
  paths: {
    preview: {
      src: 'src/preview/*',
      dest: 'preview/'
    },
    html: {
      main: 'index.html',
      src: 'src/template/*.html',
      dest: process.env.CWD
    },
    css: {
      main: 'index.css',
      src: 'src/sass/**/*.scss',
      dest: process.env.NODE_ENV == 'PRODUCTION' ? 'dist' : 'css/'
    },
    js: {
      main: 'index.js',
      src: 'src/js/*',
      dest: process.env.NODE_ENV == 'PRODUCTION' ? 'dist' : 'js/',
      data: '.json',
      polyfills: '.polyfill.js',
    },
    lib: {
      main: 'lib.js',
      src: 'src/lib/**/*',
      dest: process.env.NODE_ENV == 'PRODUCTION' ? 'dist' : 'lib/'
    },
    img: {
      src: 'src/ibmad/' + process.env.IBM_PRODUCT + '/img/*',
      dest: process.env.NODE_ENV == 'PRODUCTION' ? 'dist' : 'img/',
    },
    svg: {
      src: 'src/ibmad/' + process.env.IBM_PRODUCT + '/svg/*.svg',
      dest: process.env.NODE_ENV == 'PRODUCTION' ? 'dist' : 'svg/',
    },
    copy: {
      src: 'src/copy/**/*',
      dest: process.env.NODE_ENV == 'PRODUCTION' ? 'dist' : 'copy/'
    },
    reload: './stage/',
    test: {
      entry: 'test/index.html',
      dest: 'test/js/test.js',
    },
  },

};
```

### Header

Gulp auto-injects a header into all of your JavaScript and CSS files with details from your `package.json` file.

You can change what's included under the `banner` variable.

```js
/**
 * Template for banner to add to file headers
 */

module.exports = {
    // env references
    STAGE:
        '/*!\n'+
        '***************************************************************' + '\n' +
        '*** <%= package.name %> v<%= package.version %>' + '\n'+
        '*** <%= package.description %>' + '\n'+
        '*** (c) ' + new Date().getFullYear() + ' <%= package.author.name %>' + '\n' +
        '*** <%= package.license %> License' + '\n'+
        '*** <%= package.repository.url %>' + '\n'+
        '***************************************************************' + '\n' +
        '*/\n\n'
    ,
    PRODUCTION:
        '/*!' +
        ' <%= package.name %> v<%= package.version %>' +
        ' | (c) ' + new Date().getFullYear() + ' <%= package.author.name %>' +
        ' | <%= package.license %> License' +
        ' | <%= package.repository.url %>' +
        ' */\n'
    ,

};
```


