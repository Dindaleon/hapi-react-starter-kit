const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const WebpackStrip = require('strip-loader');

module.exports = {
  devtool: 'eval',
  entry: [
    './src/client.js'
  ],
  output: {
    path: './static/assets/',
    filename: '[name]-[hash].min.js',
    publicPath: '/assets/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin('bundle.css'),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true
      }
    }),
    new StatsPlugin('webpack.stats.json', {
      source: false,
      modules: false
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      '__SERVER__': false,
      '__CLIENT__': true,
      /*
      'PROTOCOL': JSON.stringify('http://'),
      'SERVER_HOST':
        JSON.stringify(process.env.OPENSHIFT_NODEJS_IP) ||
        JSON.stringify(process.env.IP) ||
        JSON.stringify('localhost'),
      'SERVER_PORT':
        JSON.stringify(process.env.OPENSHIFT_NODEJS_WS_PORT) ||
        JSON.stringify(process.env.PORT) ||
        JSON.stringify(8080),
     /* 'WS_PORT': JSON.stringify(process.env.OPENSHIFT_NODEJS_WS_PORT) ||
        JSON.stringify(process.env.WSPORT) ||
        JSON.stringify(8000),*/
    /*    'WSPORT': JSON.stringify(8000),
        'WS_PORT': JSON.stringify(8000),
      'REDIS_HOST':
        JSON.stringify(process.env.OPENSHIFT_REDIS_HOST) ||
        JSON.stringify(process.env.REDIS_HOST) ||
        JSON.stringify('localhost'),
      'REDIS_PORT':
        JSON.stringify(process.env.OPENSHIFT_REDIS_PORT) ||
        JSON.stringify(process.env.REDIS_PORT) ||
        JSON.stringify(6379)*/
    }),
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    })
  ],
  module: {
    preLoaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: WebpackStrip.loader('debug', 'console.log')
    }],
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        cacheDirectory: true,
        presets: [ 'es2015', 'react', 'stage-0' ],
        plugins: [ 'transform-decorators-legacy', 'transform-runtime' ]
      }
    }, {
      test: /\.json?$/,
      loader: 'json'
    }]
  }
};
