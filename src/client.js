// import libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import {
  ReduxRouter,
  reduxReactRouter
} from 'redux-router';

import { Provider } from 'react-redux';

import io from 'socket.io-client';

import createHistory from 'history/lib/createBrowserHistory';
import ApiClient from './helpers/ApiClient';

// import local files
import getRoutes from './routes';
import makeRouteHooksSafe from './helpers/makeRouteHooksSafe';
import configureStore from './store/configureStore';
import ConnectedIntlProvider from './ConnectedIntlProvider';

// import globals
import './globals';

// Define constants
const client = new ApiClient();
const initialState = window.__INITIAL_STATE__;
const activeExtensions = initialState.extensions.enabled;
const store = configureStore(
  reduxReactRouter,
  makeRouteHooksSafe(getRoutes, activeExtensions),
  activeExtensions,
  createHistory,
  client,
  initialState
);
const root = document.getElementById('root');

if ( __DEVELOPMENT__ ) {
  console.log('__INITIAL_STATE__ ', initialState); // for checking initial store state on load
  // Expose globally
  window.React = React; // enable debugger

  if (!root || !root.firstChild || !root.firstChild.attributes || !root.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  }
}

const initSocket = () => {
  const socket = io( WS_HOST + ':' + WS_PORT );
  return socket;
};

// Expose socket io
global.socket = initSocket();

const run = () => {
  ReactDOM.render(
    <Provider store = { store } key="provider">
       <ConnectedIntlProvider>
        <ReduxRouter
          children = { <Router routes={ getRoutes(store, activeExtensions) } />  } />
      </ConnectedIntlProvider>
    </Provider>,
    root
  );
};

const load = () => {
  if ( window.addEventListener ) {
    window.addEventListener( 'DOMContentLoaded', run );
  } else {
    window.attachEvent( 'onload', run );
  }
};

// Include intl polyfill for Safari browser
if (!global.Intl) {
  require.ensure([ 'intl' ], require => {
    require('intl');
    load();
  }, 'IntlBundle');
} else {
  load();
}
