import {
  SET_ACTIVE_REDUCERS,
  SET_ALL_EXTENSIONS_DATA_LOADED,
  SET_ALL_EXTENSIONS_DATA_CLEARED
} from '../actions/extensionsActions';

const initialState = {
  loadedActiveExtensions: false,
  allExtensionsDataLoaded: false,
  cleared: false
};

const extensions = ( state = initialState, action = {} ) => {
  switch (action.type) {
    case SET_ACTIVE_REDUCERS: {
      return {
        ...state,
        loadedActiveExtensions: true,
        enabled: action.extensions
      };
    }
    case SET_ALL_EXTENSIONS_DATA_LOADED: {
      return {
        ...state,
        allExtensionsDataLoaded: action.bool
      };
    }
    case SET_ALL_EXTENSIONS_DATA_CLEARED: {
      return {
        ...state,
        cleared: action.bool
      };
    }
    default: {
      return state;
    }
  }
};

export default extensions;
