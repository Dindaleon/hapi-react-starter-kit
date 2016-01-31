import { createRoutes } from 'react-router/lib/RouteUtils';

// Wrap the hooks so they don't fire if they're called before
// the store is initialised. This only happens when doing the first
// client render of a route that has an onEnter hook
const makeHooksSafe = (routes, store) => {
  if (Array.isArray(routes)) {
    return routes.map(( route ) => makeHooksSafe(route, store));
  }

  const onEnter = routes.onEnter;

  if (onEnter) {
    routes.onEnter = ( ...args ) => {
      try {
        store.getState();
      } catch (err) {
        if (onEnter.length === 3) {
          args[2]();
        }

        // There's no store yet so ignore the hook
        return;
      }

      onEnter.apply(null, args);
    };
  }

  if (routes.childRoutes) {
    makeHooksSafe(routes.childRoutes, store);
  }

  if (routes.indexRoute) {
    makeHooksSafe(routes.indexRoute, store);
  }

  return routes;
};

const makeRouteHooksSafe = (_getRoutes, activeExtensions) => {
  return ( store ) => makeHooksSafe(createRoutes(_getRoutes(store, activeExtensions)), store);
};

export default makeRouteHooksSafe;
