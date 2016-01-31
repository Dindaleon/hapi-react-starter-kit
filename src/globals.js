import config from './config';
// Prevent issues with libraries using this var (see http://tinyurl.com/pcockwk)
delete process.env.BROWSER;

// Check enviroment for production
const enviroment = process.env.NODE_ENV || 'development';
global.__DEVELOPMENT__ = enviroment === 'development';
global.__PRODUCTION__ = enviroment === 'production';

// Define defaults for development
let defaultServerProtcol = 'http://';
let defaultServerHOST = 'localhost';
let defaultServerPORT = 3000;
let defaultServerURI = config.server.deveplopmentUrl;
let defaultWsHost = 'localhost';
let defaultWsPort = 4001;
let defaultRedisHost = 'localhost';
let defaultRedisPort = 6379;
let defaultRedisDbNumber = 1;
// Define defaults for production

if ( __PRODUCTION__ ) {
  defaultServerProtcol = config.server.protocol;
  defaultServerHOST = 'localhost';
  defaultServerPORT = 8080;
  defaultServerURI = config.server.productionUrl;
  defaultWsHost = config.server.ws.host;
  defaultWsPort = config.server.ws.port;
  defaultRedisHost = 'localhost';
  defaultRedisPort = 6379;
  defaultRedisDbNumber = 1;
}

// Define protocol (http or https)
const PROTOCOL = defaultServerProtcol;
// Define cloud server host and port (For deployments) eg: OpenShift, Heorku...
const serverHOST = process.env.OPENSHIFT_NODEJS_IP; // REPLACE WITH YOUR SERVER's IP
const serverPORT = process.env.OPENSHIFT_NODEJS_PORT; // REPLACE WITH YOUR SERVER's PORT
// Define cloud server for websockets
const wsHOST = process.env.OPENSHIFT_NODEJS_WS_HOST; // usually an URL to your site
const wsPORT = process.env.OPENSHIFT_NODEJS_WS_PORT; // REPLACE WITH YOUR SERVER's WebScokets PORT
// Define cloud server dabatase settings
const redisHOST = process.env.OPENSHIFT_REDIS_HOST;
const redisPORT = process.env.OPENSHIFT_REDIS_PORT;
const redisDBNUMBER = process.env.OPENSHIFT_REDIS_DBNUMBER;

// Define Global Variables
global.PROTOCOL = PROTOCOL;
// Define server host and port
global.SERVER_HOST = serverHOST || process.env.HOST || defaultServerHOST; // Defaults to localhost for deveplopment
global.SERVER_PORT = serverPORT || process.env.PORT || defaultServerPORT;
global.SERVER_URI = defaultServerURI;
// Define websockets host and port
global.WS_HOST = wsHOST || process.env.WSHOST || defaultWsHost;
global.WS_PORT = wsPORT || process.env.WSPORT || defaultWsPort;
// Define database host and port (REDIS), and database number
global.REDIS_HOST = redisHOST || process.env.REDISHOST || defaultRedisHost;
global.REDIS_PORT = redisPORT || process.env.REDISPORT || defaultRedisPort;
global.REDIS_DBNUMBER = redisDBNUMBER || process.env.REDISDBNUMBER || defaultRedisDbNumber;
