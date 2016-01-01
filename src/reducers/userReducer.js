import { LOAD_REQUEST, LOAD_SUCCESS, LOAD_FAILURE,
         LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
         LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE,
         UPDATE_REQUEST, UPDATE_SUCCESS, UPDATE_FAILURE,
         REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE,
         SET_LOCALE,
         SWITCH_LOCALE, SWITCH_LOCALE_SUCCESS, SWITCH_LOCALE_FAILURE
       } from '../actions/userActions';
import config from '../config';

const initialState = {
  loaded: false,
  data: {
    id: 0,
    username: null,
    email: null,
    sessionId: 0,
    locale: config.user.locale
  }
};

const user = ( state = initialState, action = {} ) => {
  switch (action.type) {
    // LOAD USER
    case LOAD_REQUEST: {
      return {
        ...state,
        loading: true,
        loaded: false,
        error: false
      };
    }
    case LOAD_SUCCESS: {
      return {
        ...state,
        loading: false,
        loaded: true,
        data: Object.assign({},
          initialState.data,
          action.result.data
        )
      };
    }
    case LOAD_FAILURE: {
      return {
        ...state,
        loading: false,
        loaded: false,
        error: true
      };
    }

    // LOGIN USER
    case LOGIN_REQUEST: {
      return {
        ...state,
        loggingIn: true
      };
    }
    case LOGIN_SUCCESS: {
      return {
        ...state,
        loggingIn: false,
        data: Object.assign({},
          initialState.data,
          action.result.data
        )
      };
    }
    case LOGIN_FAILURE: {
      return {
        ...state,
        loggingIn: false,
        data: initialState.data,
        loginError: action.error
      };
    }

    // LOGOUT USER
    case LOGOUT_REQUEST: {
      return {
        ...state,
        loggingOut: true
      };
    }
    case LOGOUT_SUCCESS: {
      return {
        ...state,
        loggingOut: false,
        data: initialState.data
      };
    }
    case LOGOUT_FAILURE: {
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error
      };
    }

    // REGISTER USER
    case REGISTER_REQUEST: {
      return {
        ...state,
        registering: true,
        registered: false,
        registerError: false
      };
    }
    case REGISTER_SUCCESS: {
      return {
        ...state,
        registering: false,
        registered: true
      };
    }
    case REGISTER_FAILURE: {
      return {
        ...state,
        registering: false,
        registered: false,
        registerError: action.error
      };
    }

    // SET LOCALE
    // Mainly used for guest accounts
    case SET_LOCALE: {
      return {
        ...state,
        data: Object.assign(state.data, {
          locale: action.locale
        })
      };
    }

    // SWITCH LOCALE
    case SWITCH_LOCALE: {
      return {
        ...state,
        switchingLocale: true,
        switchedLocale: false,
        errorLocale: false
      };
    }
    case SWITCH_LOCALE_SUCCESS: {
      return {
        ...state,
        switchingLocale: false,
        switchedLocale: true,
        data: Object.assign(state.data, {
          locale: action.result.data.user.locale
        })
      };
    }
    case SWITCH_LOCALE_FAILURE: {
      return {
        ...state,
        switchingLocale: false,
        switchedLocale: false,
        errorLocale: true
      };
    }

    // UPDATE USER
    case UPDATE_REQUEST: {
      return {
        ...state,
        updating: true
      };
    }
    case UPDATE_SUCCESS: {
      return {
        ...state,
        updating: false,
        data: Object.assign(
          state.data,
          action.result.data.user
        )
      };
    }
    case UPDATE_FAILURE: {
      return {
        ...state,
        updating: false,
        updatingError: action.error
      };
    }
    default: {
      return state;
    }
  }
};

export default user;
