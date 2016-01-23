/* eslint-disable */
/* jscs: disable */
var webpack = require('webpack');
// Karma configuration
module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    client: {
      mocha: {
        reporter: 'spec',
        ui: 'bdd'
      }
    },

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [ 'mocha', 'sinon-chai'],

    // list of files / patterns to load in the browser
    files: [ 'tests.bundle.js' ],

    // list of plugins
    plugins: [
        'karma-firefox-launcher',
        'karma-coverage',
        'karma-mocha',
        'karma-mocha-reporter',
        'karma-sinon-chai',
        'karma-sourcemap-loader',
        'karma-webpack'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'tests.bundle.js': [ 'webpack', 'sourcemap' ]
    },

    reporters: ['mocha', 'coverage'],

    webpack: {
      devtool: 'inline-source-map',
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production'),
          '__SERVER__': false,
          '__CLIENT__': true
        })
      ],
      module: {
        preLoaders: [ { //delays coverage til after tests are run, fixing transpiled source coverage error
            test: /\.js$/,
            exclude: [/node_modules/, /test/, /static/, /coverage/],
            loader: 'isparta-instrumenter-loader' }
        ],             
        loaders: [
          {
            exclude: /node_modules/,
            loader: 'babel',
            test: /\.js?$/,
            /* query: {
              presets: [ 'es2015', 'react', 'stage-0' ],
              plugins: [ 'transform-decorators-legacy', 'transform-runtime' ]
            } */
          }
        ]
      }
    },
    webpackMiddleware: {
      noInfo: true,
      stats: {
        colors: true,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false,
        modules: false
      }
    },
    mochaReporter: {
      colors: {
        success: 'bgGreen',
        info: 'blue',
        warning: 'cyan',
        error: 'bgRed'
      }
    },
    coverageReporter: {
      // configure the reporter to use isparta for JavaScript coverage
      // Only on { "karma-coverage": "douglasduteil/karma-coverage#next" }
      instrumenters: { isparta : require('isparta') },
      instrumenter: {
        '**/*.js': 'isparta'
      },
      dir: 'coverage/', //path to created html doc
      reporters: [
        { type: 'lcovonly', subdir: 'lcovonly', file: 'lcov.info' },
        { type: 'html', subdir: 'html' }
      ]
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  })
}
