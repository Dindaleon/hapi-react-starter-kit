export const SET_ACTIVE_REDUCERS = 'SET_ACTIVE_REDUCERS';

export const setActiveReducers = extensions => {
  return {
    type: SET_ACTIVE_REDUCERS,
    extensions
  };
};

export const loaded = ( globalState ) => {
  return globalState.extensions && globalState.extensions.loadedActiveExtensions;
};
