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
import routes from './routes';
import createLocation from 'history/lib/createLocation'

//import assets
import assets from '../static/assets/webpack.stats.json'

export default function(HOST, PORT, callback) {
  // Create the Walmart Labs Hapi Server
  const server = new Hapi.Server();
  server.connection({ host: HOST, port: PORT });
  // Register Hapi plugins
  server.register([{
    register:Inert
  }, {
    register:h2o2    
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
    /**
     * Catch dynamic requests here to fire-up React Router.
     */
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

            output = Transmit.injectIntoMarkup(output, reactData, [`./assets/${assets.assetsByChunkName.main}`]);

            reply(output);
          }).catch((error) => {
            console.error(error);
          });
        }
      })

    });
  });
  // Start Production Server    
  return server.start(() => callback(server))
}