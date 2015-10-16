// Webpack imports
import webpack from 'webpack';
import WebpackPlugin from 'hapi-webpack-plugin';
import webpackConfig from '../webpack/dev.config';

// Hapi server imports
import Hapi from 'hapi';
import Inert from 'inert';
import h2o2 from "h2o2";

// React imports
import React from 'react';
import Transmit from "react-transmit";
import {RoutingContext, match} from 'react-router';
import {renderToString} from 'react-dom/server';

// React-router routes and history imports
import routes from '../src/routes';
import createLocation from 'history/lib/createLocation'

// Start server function
export default function(HOST, PORT, callback) {
  // Create the Walmart Labs Hapi Server
  const server = new Hapi.Server();
  server.connection({ host: HOST, port: PORT });
  // Webpack compiler
  const compiler = webpack(webpackConfig);
  const assets = {
    // webpack-dev-middleware options 
    // See https://github.com/webpack/webpack-dev-middleware 
    publicPath: '/',
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    } 
  }
  const hot = {
    // webpack-hot-middleware options 
    // See https://github.com/glenjamin/webpack-hot-middleware 
    timeout:'20000',
    reload:true
  }
 
  // Register Hapi plugins
  server.register([{
    register:Inert
  }, {
    register:h2o2
  }, {
    register: WebpackPlugin,
    options: {compiler,assets,hot} 
  }], function(error) {
    if (error) {
      return console.error(error)
    }

  /**
   * Attempt to serve static requests from the public folder.
   */
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: 'static'
            }
        }
    });
  
    server.ext('onPreResponse', function(request, reply) {
      if (typeof request.response.statusCode !== 'undefined') {
        return reply.continue();
      }
      let location = createLocation(request.path)
      match({ routes, location }, (error, redirectLocation, renderProps) => {
        if (error || !renderProps) {
         // reply("500: " + error.message)
         reply.continue();
        } else if (redirectLocation) {
          reply.redirect(redirectLocation.pathname + redirectLocation.search);
        } else if (renderProps) {
          //reply(renderToString(<RoutingContext {...renderProps} />))
          Transmit.renderToString(RoutingContext, renderProps).then(({reactString, reactData}) => {
            let output = (
              `<!doctype html>
              <html lang="en-us">
                <head>
                  <meta charset="utf-8">
                  <title>hapi-react-starter-kit</title>
                  <link rel="shortcut icon" href="/favicon.ico">
                </head>
                <body>
                  <div id="root"></div>
                </body>
              </html>`
            );

            const webserver = process.env.NODE_ENV === "production" ? "" : "//"+HOST+":"+PORT;
            output          = Transmit.injectIntoMarkup(output, reactData, [`${webserver}/bundle.js`]);

            reply(output);
          }).catch((error) => {
            console.error(error);
          });
        }
      })

    });
  });
  // Start Development Server    
  return server.start(() => callback(server))
}