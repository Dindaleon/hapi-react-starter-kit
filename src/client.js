import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory'
import routes from './routes';
let history = createBrowserHistory();

// Expose globally
window.React = React;

var App = require('./components/App.js')

function run() {
	ReactDOM.render(
	   <Router
	    children={routes}
	    history={history} />,
	  document.getElementById('root')
	);
}

if (window.addEventListener) {
  window.addEventListener('DOMContentLoaded', run);
} else {
  window.attachEvent('onload', run);
}