// Register babel to have ES6 support on the server
require("babel/register");   
var chalk = require('chalk');

// Prevent issues with libraries using this var (see http://tinyurl.com/pcockwk)
delete process.env.BROWSER;

// Check enviroment for production
var enviroment = process.env.NODE_ENV || 'development'

// Production Server details 
var serverIP = process.env.OPENSHIFT_NODEJS_IP; // REPLACE WITH YOUR SERVER's IP 
var serverPORT = process.env.OPENSHIFT_NODEJS_PORT; // REPLACE WITH YOUR SERVER's PORT
var HOST = serverIP || process.env.IP || 'localhost'
var PORT = serverPORT || process.env.PORT || 3000;

// Load server depending on the enviroment
if (enviroment === "development") {
	require("./webpack/devServer")(HOST, PORT, function (server) {
		console.info(chalk.bold.green("==> 🌎 Hapi Development Server is listening on", server.info.uri));
	});
} else {
	require("./src/server")(HOST, PORT, function (server) {
		console.info(chalk.bold.green("==> 🌎 Hapi Production Server is listening on", server.info.uri));
	});
}

    



