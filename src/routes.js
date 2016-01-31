// App Container
import App from './containers/AppContainer';

// Core Pages
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Hall from './pages/Hall';
import Index from './pages/Index';
import RegisterPage from './pages/Register';
import Room from './pages/Room';
import LoginPage from './pages/Login';

// This will append extensions pages/routes to the default ones.
import loadExtensionsPages from './helpers/loadExtensionsPages';

// Actions
import { load, isAuthLoaded } from './actions/userActions';
import { loadLocale, isLocaleLoaded } from './actions/localeActions';

export default ( store, activeExtensions ) => {
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

  const routeConfig = [
    { path: '/',
      component: App,
      indexRoute: { component: Index },
      childRoutes: [
        { path: 'home', component: Home },
        { onEnter: redirectToDashboard,
          childRoutes: [
            { path: 'login', component: LoginPage },
            { path: 'register', component: RegisterPage }
          ]
        },
        { onEnter: redirectToLogin,
          childRoutes: [
            { path: 'dashboard', component: Dashboard },
            { path: 'hall', component: Hall },
            { path: 'room/:id', component: Room }
          ]
        }
      ]
    }
  ];

  return loadExtensionsPages(routeConfig, activeExtensions);
};
