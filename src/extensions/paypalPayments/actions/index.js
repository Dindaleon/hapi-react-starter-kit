export const LOAD_USER_PAYMENT = 'LOAD_USER_PAYMENT';
export const LOAD_USER_PAYMENT_SUCCESS = 'LOAD_USER_PAYMENT_SUCCESS';
export const LOAD_USER_PAYMENT_FAILURE = 'LOAD_USER_PAYMENT_FAILURE';
export const CREATE_PAYMENT = 'CREATE_PAYMENT';
export const CREATE_PAYMENT_SUCCESS = 'CREATE_PAYMENT_SUCCESS';
export const CREATE_PAYMENT_FAILURE = 'CREATE_PAYMENT_FAILURE';
export const EXECUTE_PAYMENT = 'EXECUTE_PAYMENT';
export const EXECUTE_PAYMENT_SUCCESS = 'EXECUTE_PAYMENT_SUCCESS';
export const EXECUTE_PAYMENT_FAILURE = 'EXECUTE_PAYMENT_FAILURE';
export const CREATE_PAYOUT = 'CREATE_PAYOUT';
export const CREATE_PAYOUT_SUCCESS = 'CREATE_PAYOUT_SUCCESS';
export const CREATE_PAYOUT_FAILURE = 'CREATE_PAYOUT_FAILURE';
export const UPDATE_USER_FUNDS = 'UPDATE_USER_FUNDS';
export const CLEAR_USER_PAYMENT_DATA = 'CLEAR_USER_PAYMENT_DATA';

export const loadUserPayment = ( user ) => {
  return {
    type: [ LOAD_USER_PAYMENT ],
    promise: ( client ) => client.get('/users/' + user.id + '/payments', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': user.accessToken
      }
    })
  };
};

export const createPayment = ( user, amount ) => {
  return {
    type: [ CREATE_PAYMENT ],
    promise: ( client ) => client.post('/payments/create', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': user.accessToken
      },
      data: {
        userId: parseInt(user.id, 10),
        amount: Number(amount)
      }
    })
  };
};

export const executePayment = ( user, paymentId, payerID ) => {
  return {
    type: [ EXECUTE_PAYMENT ],
    promise: ( client ) => client.post('/payments/execute', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': user.accessToken
      },
      data: {
        userId: parseInt(user.id, 10),
        paymentId,
        payerID
      }
    })
  };
};

export const createPayout = ( user, amount ) => {
  return {
    type: [ CREATE_PAYOUT ],
    promise: ( client ) => client.post('/payments/payouts', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': user.accessToken
      },
      data: {
        userId: parseInt(user.id, 10),
        amount: Number(amount)
      }
    })
  };
};

export const updateUserFunds = funds => {
  return {
    type: UPDATE_USER_FUNDS,
    funds
  };
};

export const clearPaymentData = () => {
  return {
    type: CLEAR_USER_PAYMENT_DATA
  };
};

export const isUserPaymentLoaded = ( globalState ) => {
  return globalState.paypalPayments && globalState.paypalPayments.loaded;
};
