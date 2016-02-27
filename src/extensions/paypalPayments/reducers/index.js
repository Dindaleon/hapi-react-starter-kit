import {
  LOAD_USER_PAYMENT_REQUEST, LOAD_USER_PAYMENT_SUCCESS, LOAD_USER_PAYMENT_FAILURE,
  CREATE_PAYMENT_REQUEST, CREATE_PAYMENT_SUCCESS, CREATE_PAYMENT_FAILURE,
  EXECUTE_PAYMENT_REQUEST, EXECUTE_PAYMENT_SUCCESS, EXECUTE_PAYMENT_FAILURE,
  CREATE_PAYOUT_REQUEST, CREATE_PAYOUT_SUCCESS, CREATE_PAYOUT_FAILURE,
  UPDATE_USER_FUNDS,
  CLEAR_USER_PAYMENT_DATA
} from '../actions';

const initialState = {
  loaded: false,
  created: false,
  executed: false,
  user_payments: {
    funds: 0
  }
};

const payments = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_USER_PAYMENT_REQUEST: {
      return {
        ...state,
        loaded: false,
        loading: true,
        error: false
      };
    }
    case LOAD_USER_PAYMENT_SUCCESS: {
      return {
        ...state,
        loaded: true,
        loading: false,
        user_payments: Object.assign(
          {},
          state.user_payments,
          action.result.data.user
        )
      };
    }
    case LOAD_USER_PAYMENT_FAILURE: {
      return {
        ...state,
        loaded: false,
        loading: false,
        error: action.error.toString()
      };
    }
    case CREATE_PAYMENT_REQUEST: {
      return {
        ...state,
        created: false,
        creating: true,
        error: false
      };
    }
    case CREATE_PAYMENT_SUCCESS: {
      return {
        ...state,
        created: true,
        creating: false
      };
    }
    case CREATE_PAYMENT_FAILURE: {
      return {
        ...state,
        created: false,
        creating: false,
        error: action.error.toString()
      };
    }
    case EXECUTE_PAYMENT_REQUEST: {
      return {
        ...state,
        executed: false,
        executing: true,
        error: false
      };
    }
    case EXECUTE_PAYMENT_SUCCESS: {
      return {
        ...state,
        executed: true,
        executing: false,
        user_payments: Object.assign({}, state.user_payments, action.result.data)
      };
    }
    case EXECUTE_PAYMENT_FAILURE: {
      return {
        ...state,
        executed: false,
        executing: false,
        error: action.error.toString()
      };
    }
    case CREATE_PAYOUT_REQUEST: {
      return {
        ...state,
        payoutCreated: false,
        payoutreating: true,
        error: false
      };
    }
    case CREATE_PAYOUT_SUCCESS: {
      return {
        ...state,
        payoutCreated: true,
        payoutreating: false,
        user_payments: Object.assign({}, state.user_payments, action.result.data)
      };
    }
    case CREATE_PAYOUT_FAILURE: {
      return {
        ...state,
        payoutCreated: false,
        payoutreating: false,
        error: action.error.toString()
      };
    }
    case UPDATE_USER_FUNDS: {
      return {
        ...state,
        user_payments: {
          funds: action.funds
        }
      };
    }
    case CLEAR_USER_PAYMENT_DATA: {
      return Object.assign({}, initialState);
    }
    default:
      return state;
  }
};

export default payments;
