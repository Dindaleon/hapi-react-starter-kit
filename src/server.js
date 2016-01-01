/* eslint-disable no-console */

// Hapi server imports
import Hapi from 'hapi';
import Inert from 'inert';
import Vision from 'vision';
import swagger from 'hapi-swagger';
import jwt from 'hapi-auth-jwt2';
import api from './api';
import rooms from './rooms';
import issueToken from './issueToken';

// React imports
import React from 'react';
import { renderToString } from 'react-dom/server';

// React-router routes and history imports
import getRoutes from './routes';
import createHistory from 'history/lib/createMemoryHistory';

// Redux imports
import { Provider } from 'react-redux';

// Import Intl
import { IntlProvider } from 'react-intl';
import * as lang from './lang';

// Configure Redux Store
import configureStore from './store/configureStore';

// Redux router imports
import { ReduxRouter } from 'redux-router';
import { reduxReactRouter, match } from 'redux-router/server';
import qs from 'query-string';

// Import helpers
import ApiClient from './helpers/ApiClient';
import Html from './helpers/Html';

// Import config file
import config from './config';

// Start server function
export default function( callback ) {
  // Create the Walmart Labs Hapi Server
  const server = new Hapi.Server(); // No debug no production
  // Configure connections
  server.connection({
    host: SERVER_HOST,
    port: SERVER_PORT,
    labels: [ 'api' ],
    routes: {
      cors: {
        origin: [ PROTOCOL + WS_HOST + ':' + WS_PORT ]
      }
    }
  });
  server.connection({
    host: SERVER_HOST,
    port: WS_PORT,
    labels: [ 'ws' ],
    routes: {
      cors: {
        origin: [ PROTOCOL + WS_HOST + ':' + SERVER_PORT ]
      }
    }
  });

  // Set names for each connection
  server.connections[0].name = 'API';
  server.connections[1].name = 'WS';

  const apiServer = server.select('api');
  // const wsServer = server.select('ws');

  server.register([
    {
      register: Inert
    }, {
      register: Vision
    }, {
      register: jwt
    }, {
      register: issueToken
    }, {
      register: api,
      routes: {
        prefix: config.api.routes.path
      }
    }, {
      register: rooms,
      options: {
        server: apiServer
      }
    }
  ], (err) => {
    if (err) {
      throw err;
    }
    server.register([
      {
        register: swagger,
        options: {
          documentationPath: config.api.swagger.documentationPath
        }
      }
    ], { select: [ 'api' ] }, ( error ) => {
      if ( error ) {
        return console.error( error );
      }

      /**
       * Attempt to serve static requests from the public folder.
       */
      apiServer.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
          directory: {
            path: 'static'
          }
        }
      });

      /**
       * Cookie Settings
       */
      apiServer.state('USER_SESSION', {
        ttl: null,
        isSecure: !__DEVELOPMENT__,
        isHttpOnly: false,
        encoding: 'none',
        clearInvalid: false, // remove invalid cookies
        strictHeader: false // don't allow violations of RFC 6265
      });

      server.ext( 'onPreResponse', ( request, reply ) => {
        if ( typeof request.response.statusCode !== 'undefined' ) {
          return reply.continue();
        }
        const client = new ApiClient(request);
        const store = configureStore(reduxReactRouter, getRoutes, createHistory, client);

        const output = (
          renderToString( <Html store={ store }/> )
        );

        const hydrateOnClient = () => {
          reply( '<!doctype html>\n' + output ).code(500);
        };

        store.dispatch( match( request.path, ( error, redirectLocation, routerState ) => {
          if ( redirectLocation ) {
            reply.redirect( redirectLocation.pathname + redirectLocation.search );
          } else if ( error || !routerState ) {
            hydrateOnClient();
          } else if ( routerState ) {
            if (routerState.location.search && !routerState.location.query) {
              routerState.location.query = qs.parse(routerState.location.search);
            }

            store.getState().router.then(() => {
              const component = (
                  < Provider store={ store } key="provider">
                    <IntlProvider key={ store.getState().user.data.locale }
                                  locale={ store.getState().user.data.locale }
                                  messages={ lang[store.getState().user.data.locale] }>
                      <ReduxRouter/>
                    </IntlProvider>
                  </Provider>
                );

              const output = (
                  renderToString( <Html component={ component } store={ store } /> )
                );

              reply( '<!doctype html>\n' + output);
            })
            .catch(err => reply('error: ' + err));
          }
        }));
      });
    });
  });
  // Start Development Server
  return server.start(() => callback( server ));
}
