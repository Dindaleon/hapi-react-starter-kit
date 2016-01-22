const webpack = require( 'webpack' );
module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true',
    './src/client.js'
  ],
  output: {
    path: __dirname + '/dist/',
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
   // new webpack.IgnorePlugin(/\.json$/),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify( 'development' ),
      '__SERVER__': false,
      '__CLIENT__': true
    }),
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          // cacheDirectory: false,
          presets: [ 'es2015', 'react', 'stage-0' ],
          plugins: [
            [ 'transform-decorators-legacy' ],
            [ 'transform-runtime' ],
            [ 'react-transform', {
              transforms: [{
                transform: 'react-transform-hmr',
                imports: [ 'react' ],
                locals: [ 'module' ],
              }, {
                transform: 'react-transform-catch-errors',
                imports: [ 'react', 'redbox-react' ],
              }]
            }]
          ]
        }
      },
      {
        test: /\.json?$/,
        loader: 'json'
      }
    ]
  },
};

