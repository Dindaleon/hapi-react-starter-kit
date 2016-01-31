/*
 * loadExtensionsData
 * checks if extensions need to load data for server rendering
 * after data has been loaded into the store
 * dispactch an action that indicates so.
 */
import Promise from 'bluebird';
import customRequire from './customRequire';

const clearExtensionsData = (state, dispatch) => {
  const promises = [];
  // TODO if all pre load data has been loaded, exit.
  // ^ this is being done at App Component.
  // get all active extensions that need preloaded data
  for ( const extension of state.extensions.enabled ) {
    try {
      const extensionClearData = customRequire('/' + extension.folderName + '/index').clearData;
      if (typeof extensionClearData !== 'undefined') {
        for ( const clearData of extensionClearData ) {
          if (clearData.needs === 'user' &&
              clearData.isLoaded(state) &&
              clearData.scopes.indexOf(state.user.data.scope) >= 0
            ) {
            promises.push(dispatch(clearData.function()));
          }
        }
      }
    } catch (e) {
      // console.log('Extension does not need to clear data.');
    }
  }
  return Promise.all(promises);
};

export default clearExtensionsData;
