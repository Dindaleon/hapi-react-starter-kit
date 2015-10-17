/* eslint-disable no-console */

// Register babel to have ES6 support on the server
require( 'babel/register' );
const chalk = require( 'chalk' );

// Prevent issues with libraries using this var (see http://tinyurl.com/pcockwk)
delete process.env.BROWSER;

// Check enviroment for production
const enviroment = process.env.NODE_ENV || 'development';

// Production Server details
const serverIP = process.env.OPENSHIFT_NODEJS_IP; // REPLACE WITH YOUR SERVER's IP
const serverPORT = process.env.OPENSHIFT_NODEJS_PORT; // REPLACE WITH YOUR SERVER's PORT
const HOST = serverIP || process.env.IP || 'localhost';
const PORT = serverPORT || process.env.PORT || 3000;

// Load server depending on the enviroment
if ( enviroment === 'development' ) {
  require( './webpack/devServer' )( HOST, PORT, server => {
    console.info( chalk.bold.green( '==> 🌎 Hapi Development Server is listening on', server.info.uri ));
  });
} else {
  require( './src/server' )( HOST, PORT, ( server ) => {
    console.info( chalk.bold.green( '==> 🌎 Hapi Production Server is listening on', server.info.uri ));
  });
}

