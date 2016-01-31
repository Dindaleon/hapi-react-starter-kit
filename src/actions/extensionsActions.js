export const SET_ACTIVE_REDUCERS = 'SET_ACTIVE_REDUCERS';
export const SET_ALL_EXTENSIONS_DATA_LOADED = 'SET_ALL_EXTENSIONS_DATA_LOADED';
export const SET_ALL_EXTENSIONS_DATA_CLEARED = 'SET_ALL_EXTENSIONS_DATA_CLEARED';

export const setActiveReducers = extensions => {
  return {
    type: SET_ACTIVE_REDUCERS,
    extensions
  };
};

export const setAllExtensionsDataLoaded = bool => {
  return {
    type: SET_ALL_EXTENSIONS_DATA_LOADED,
    bool
  };
};

export const setAllExtensionsDataCleared = bool => {
  return {
    type: SET_ALL_EXTENSIONS_DATA_CLEARED,
    bool
  };
};

export const allExtensionsDataLoaded = ( globalState ) => {
  return globalState.extensions && globalState.extensions.allExtensionsDataLoaded;
};

export const allExtensionsDataCleared = ( globalState ) => {
  return globalState.extensions && globalState.extensions.cleared;
};

export const loaded = ( globalState ) => {
  return globalState.extensions && globalState.extensions.loadedActiveExtensions;
};
