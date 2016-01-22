/**
 * Import dependencies
 */
import Path from 'path';
import Webpack from 'webpack';
import _webpackDevMiddleware from 'webpack-dev-middleware';
import _webpackHotMiddleware from 'webpack-hot-middleware';


/**
 * Define plugin
 */
const register = (server, options, next) => {
  // Define variables
  let config = {};
  let compiler;

  // Require config from path
  if (typeof options === 'string') {
    const configPath = Path.resolve(process.cwd(), options);
    config = require(configPath);
    compiler = new Webpack(config);
  } else {
    config = options;
    compiler = config.compiler;
  }

  const developmentOnly = config.developmentOnly === true ? true : false;
  if ( developmentOnly === true ) {
    // Create middlewares
    const webpackDevMiddleware = _webpackDevMiddleware(compiler, config.assets);
    const webpackHotMiddleware = _webpackHotMiddleware(compiler, config.hot);

    // Handle webpackDevMiddleware
    server.ext('onRequest', (request, reply) => {
      const { req, res } = request.raw;
      webpackDevMiddleware(req, res, error => {
        if (error) {
          return reply(error);
        }
        reply.continue();
      });
    });

    // Handle webpackHotMiddleware
    server.ext('onRequest', (request, reply) => {
      const { req, res } = request.raw;
      webpackHotMiddleware(req, res, error => {
        if (error) {
          return reply(error);
        }
        reply.continue();
      });
    });

    // Expose compiler
    server.expose({ compiler });
  }
  // Done
  return next();
};


/**
 * Define plugin attributes
 */
register.attributes = {
  name: 'hapiWebpack',
  version: '0.0.1'
};


/**
 * Export plugin
 */
export default register;
