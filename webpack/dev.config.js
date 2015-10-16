var webpack = require('webpack');

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
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      '__DEV__': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
      	stage: 0,
			      plugins: ["react-transform"],
			      extra: {
			        'react-transform': {
			          transforms: [{
			            transform: "react-transform-hmr",
			            imports: ["react"],
			            locals: ["module"]
			          }, {
			            transform: "react-transform-catch-errors",
			            imports: ["react", "redbox-react"]
			          }]
			        }
			      }
			    }
    }, {
      test: /\.json?$/,
      loader: 'json'
    }]
  }
};