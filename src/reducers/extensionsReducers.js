import { SET_ACTIVE_REDUCERS } from '../actions/extensionsActions';

const initialState = {
  // loadedActiveContainers: false,
  loadedActiveExtensions: false
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
    default: {
      return state;
    }
  }
};

export default extensions;
