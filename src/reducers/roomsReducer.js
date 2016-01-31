import { LOAD_MESSAGES_REQUEST, LOAD_MESSAGES_SUCCESS, LOAD_MESSAGES_FAILURE,
         RESET_MESSAGES, RESET_MESSAGES_SUCCESS, RESET_MESSAGES_FAILURE,
         CLEAN_ROOMS_LIST,
         CREATE_ROOM_REQUEST, CREATE_ROOM_SUCCESS, CREATE_ROOM_FAILURE,
         LIST_ROOM_REQUEST, LIST_ROOM_SUCCESS, LIST_ROOM_FAILURE
       } from '../actions/roomsActions';

const initialState = {
  loaded: false,
  reload: false,
  data: {
    rooms: {},
    lists: []
  }
};

const rooms = (state = initialState, action = {}) => {
  switch (action.type) {
    case CLEAN_ROOMS_LIST: {
      return {
        ...state,
        listed: false,
        data: {
          lists: []
        }
      };
    }
    case CREATE_ROOM_REQUEST: {
      return {
        ...state,
        creating: true,
        created: false,
        error: false
      };
    }
    case CREATE_ROOM_SUCCESS: {
      return {
        ...state,
        creating: false,
        created: true,
      };
    }
    case CREATE_ROOM_FAILURE: {
      return {
        ...state,
        creating: false,
        created: false,
        error: true
      };
    }
    case LOAD_MESSAGES_REQUEST: {
      return {
        ...state,
        loading: true,
        loaded: false,
        error: false
      };
    }
    case LOAD_MESSAGES_SUCCESS: {
      return {
        ...state,
        loading: false,
        loaded: true,
        data: Object.assign({}, state.data, {
          // here should be state instead of initialState
          rooms: Object.assign({}, initialState.data.rooms,
            {
              [action.result.data.id]: {
                messages: action.result.data.messages
              }
            }
          )
        })
      };
    }
    case LOAD_MESSAGES_FAILURE: {
      return {
        ...state,
        loading: false,
        loaded: false,
        error: true
      };
    }
    case RESET_MESSAGES: {
      return {
        ...state,
        loaded: false
      };
    }
    case RESET_MESSAGES_SUCCESS: {
      return {
        ...state,
        reloading: false,
        reloaded: true,
        loaded: false
      };
    }
    case RESET_MESSAGES_FAILURE: {
      return {
        ...state,
        reloading: false,
        reloaded: false,
        error: true
      };
    }
    case LIST_ROOM_REQUEST: {
      return {
        ...state,
        listing: true,
        listed: false,
        error: false
      };
    }
    case LIST_ROOM_SUCCESS: {
      return {
        ...state,
        listing: false,
        listed: true,
        data: {
          lists: Object.assign({},
            action.result.data
            )
        }
      };
    }
    case LIST_ROOM_FAILURE: {
      return {
        ...state,
        listing: false,
        listed: false,
        error: true
      };
    }
    default: {
      return state;
    }
  }
};

export default rooms;
