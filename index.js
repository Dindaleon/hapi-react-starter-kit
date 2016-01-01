/* eslint-disable no-var, vars-on-top, no-console */

// Register babel to have ES6 support on the server
require( 'babel-core/register' )({
  ignore: /node_modules/,
  presets: [ 'es2015', 'stage-0', 'react' ],
  plugins: [ 'transform-decorators-legacy', 'transform-runtime' ]
});
const chalk = require( 'chalk' );
require('./src/globals');
global.__SERVER__ = true;

if ( __DEVELOPMENT__ ) {
  const devServer = require( './webpack/devServer' ).default;
  devServer( server => {
    for ( var key of Object.keys(server.connections) ) {
      console.info( chalk.bold.green( '==> 🌎 Hapi Development Server (' + server.connections[key].name + ') is listening on', server.connections[key].info.uri ));
    }
  });
} else {
  const server = require( './src/server' ).default;
  server( server => {
    for ( var key of Object.keys(server.connections) ) {
      console.info( chalk.bold.green( '==> 🌎 Hapi Production Server (' + server.connections[key].name + ') is listening on', server.connections[key].info.uri ));
    }
  });
}
