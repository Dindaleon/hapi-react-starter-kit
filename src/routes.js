import React from 'react';
import { Route, IndexRoute } from 'react-router';

// App Container
import App from './containers/AppContainer';

// Pages
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Hall from './pages/Hall';
import Index from './pages/Index';
import RegisterPage from './pages/Register';
import Rooms from './containers/RoomsContainer';
import LoginPage from './pages/Login';

// Actions
import { load, isAuthLoaded } from './actions/userActions';
import { loadLocale, isLocaleLoaded } from './actions/localeActions';

export default ( store ) => {
  const checkSession = () => {
    const { user: { data: { sessionId }}} = store.getState();
    let isLoggedIn = false;
    if (sessionId !== 0 && typeof sessionId !== 'undefined' ) {
      isLoggedIn = true;
    }
    return isLoggedIn;
  };

  const checkAuth = ( cb ) => {
    if (!isAuthLoaded(store.getState())) {
      let accessToken = null;

      if (!__SERVER__ && typeof localStorage === 'object') {
        accessToken = localStorage.accessToken;
      }
      store.dispatch(load({ data: accessToken })).then(() => {
        // checkAuth();
        cb(checkSession());
        if (!isLocaleLoaded(store.getState())) {
          // Load locale for logged in user
          store.dispatch(loadLocale(store.getState().user.data.locale));
        }
      });
    } else {
      return cb(checkSession());
    }
  };

  const redirectToLogin = ( nextState, replaceState, cb ) => {
    checkAuth( isLoggedIn => {
      if (!isLoggedIn)  {
        replaceState(null, '/login');
      }
      cb();
    });
  };

  const redirectToDashboard = ( nextState, replaceState, cb ) => {
    checkAuth( isLoggedIn => {
      if (isLoggedIn)  {
        replaceState(null, '/dashboard');
      }
      cb();
    });
  };

  return (
    <Route path="/" component={ App }>
      <IndexRoute component={ Index }/>
      <Route path="home" component={ Home } />
      <Route onEnter={ redirectToDashboard }>
        <Route path="login" component={ LoginPage } />
        <Route path="register" component={ RegisterPage } />
      </Route>
      <Route onEnter={ redirectToLogin }>
        <Route path="dashboard" component={ Dashboard } />
        <Route path="hall" component={ Hall } />
        <Route path="rooms/:id" component={ Rooms } />
      </Route>
    </Route>
  );
};
