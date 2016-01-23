const webpack = require('webpack');
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
      '__CLIENT__': true
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
      /* query: {
        cacheDirectory: true,
        presets: [ 'es2015', 'react', 'stage-0' ],
        plugins: [ 'transform-decorators-legacy', 'transform-runtime' ]
      } */
    }, {
      test: /\.json?$/,
      loader: 'json'
    }]
  }
};
