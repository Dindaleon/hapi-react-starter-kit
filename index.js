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

const enviroment = __DEVELOPMENT__ ? 'Development' : 'Production';

const server = require( './src/server' ).default;
server( server => {
  for ( var key of Object.keys(server.connections) ) {
    console.info( chalk.bold.green( '==> 🌎 Hapi ' + enviroment + ' Server (' + server.connections[key].name + ') is listening on', server.connections[key].info.uri ));
  }
});
