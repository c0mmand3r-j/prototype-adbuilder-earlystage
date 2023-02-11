/**
 * Gulp configuration
 */

module.exports = {
  /**
   * Paths to project folders
   */
  paths: {
    ibmad: {
      src: process.env.IBM_PATH + '**/*',
      dest: 'preview/'
    },
    preview: {
      src: 'src/preview/*',
      dest: 'preview/'
    },
    html: {
      main: 'index.html',
      src: 'src/template/**/*',
      dest: process.env.CWD
    },
    css: {
      main: 'index.css',
      src: 'src/sass/**/*.scss',
      dest: process.env.NODE_ENV == 'PRODUCTION' ? 'dist' : 'stage'
    },
    js: {
      main: 'index.js',
      src: 'src/js/**/*.js',
      dest: process.env.NODE_ENV == 'PRODUCTION' ? 'dist' : 'stage',
      data: '.json',
      polyfills: '.polyfill.js',
    },
    lib: {
      main: 'lib.js',
      src: 'src/lib/**/*',
      dest: process.env.NODE_ENV == 'PRODUCTION' ? 'dist' : 'stage'
    },
    img: {
      src: 'src/ibmad/' + process.env.IBM_PRODUCT + '/img/*',
      dest: process.env.NODE_ENV == 'PRODUCTION' ? 'dist' : 'stage',
    },
    svg: {
      src: 'src/ibmad/' + process.env.IBM_PRODUCT + '/svg/*.svg',
      dest: process.env.NODE_ENV == 'PRODUCTION' ? 'dist' : 'stage',
    },
    copy: {
      src: 'src/copy/**/*',
      dest: process.env.NODE_ENV == 'PRODUCTION' ? 'dist' : 'stage'
    },
    reload: process.env.STAGE,
    test: {
      spec: process.env.IBM_PATH + '*.spec',
      coverage: 'test/coverage/',
      entry: 'test/index.test.js',
      dest: 'test/dist/',
    },
  },
};
