import { createStore, applyMiddleware } from 'redux';
import reducers from '../reducers';
import logger from '../middleware/logger';
import promiseSimple from '../middleware/promiseSimple';
import transitionMiddleware from '../middleware/transitionMiddleware';

const configureStore = (reduxReactRouter, getRoutes, activeReducers, createHistory, client, initialState) => {
  let finalCreateStore;
  const middleware = [
    promiseSimple(client),
    transitionMiddleware
  ];
  if ( __DEVELOPMENT__ ) {
    middleware.push(logger);
  }

  finalCreateStore = applyMiddleware(
    ...middleware
  )(createStore);

  finalCreateStore = reduxReactRouter({
    getRoutes,
    createHistory
  })(finalCreateStore);

  const store = finalCreateStore(
    reducers(activeReducers),
    initialState
  );

  if (__DEVELOPMENT__ && module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers'));
    });
  }

  return store;
};

export default configureStore;
