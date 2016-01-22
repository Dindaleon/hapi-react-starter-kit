import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import counter from './counter';
import user from './userReducer';
import rooms from './roomsReducer';
import i18l from './localeReducer';
import extensions from './extensionsReducers';

export default function(activeReducers) {
  const extendedReducers = {};
  const pathToExtensionsFolder = '../extensions';
  let customRequire = () => 'undefined';
  let extensionReducer = {};
  if (__SERVER__) {
    customRequire = extensionFolderName => {
      extensionReducer = require(pathToExtensionsFolder + '/' + extensionFolderName + '/reducers/index.js' );

      return extensionReducer;
    };
  } else {
    const req = require.context('../extensions', true);
    customRequire = extensionFolderName => {
      extensionReducer = req( './' + extensionFolderName + '/reducers/index.js' );
      return extensionReducer;
    };
  }


  for (const activeReducer of activeReducers) {
    extendedReducers[activeReducer.name] = customRequire(activeReducer.reducerName).default;
  }

  const rootReducer = combineReducers({
    ...extendedReducers,
    counter,
    rooms,
    i18l,
    user,
    extensions,
    router: routerStateReducer
  });

  return rootReducer;
}
