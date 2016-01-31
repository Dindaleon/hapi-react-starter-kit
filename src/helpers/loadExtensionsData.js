/*
 * loadExtensionsData
 * checks if extensions need to load data for server rendering
 * after data has been loaded into the store
 * dispactch an action that indicates so.
 */
import Promise from 'bluebird';
import customRequire from './customRequire';

const loadExtensionsData = (state, dispatch) => {
  const promises = [];
  // TODO if all pre load data has been loaded, exit.
  // ^ this is being done at App Component.
  // get all active extensions that need preloaded data
  for ( const extension of state.extensions.enabled ) {
    try {
      const extensionPreloads = customRequire('/' + extension.folderName + '/index').preLoad;
      if (typeof extensionPreloads !== 'undefined') {
        for ( const preLoad of extensionPreloads ) {
          if (preLoad.needs === 'user' &&
              !preLoad.isLoaded(state) &&
              preLoad.scopes.indexOf(state.user.data.scope) >= 0
            ) {
            promises.push(dispatch(preLoad.function(state.user.data)));
          }
        }
      }
    } catch (e) {
      // console.log('Extension does not need to preload data.');
    }
  }
  // dispatch all extensions loaded action
  // This has been moved to App component
  // dispatch(setAllExtensionsDataLoaded(true));
  return Promise.all(promises);
};

export default loadExtensionsData;
