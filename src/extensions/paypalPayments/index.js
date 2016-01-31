// Extension name: Paypal Payments
import {
  clearPaymentData,
  isUserPaymentLoaded as isLoaded,
  loadUserPayment
} from './actions';

const config = {
  name: 'Paypal Payments',
  active: true,
  port: 5000,
  api: {
    host: 'https://api.sandbox.paypal.com', // SandBox Api
    // host: 'https://api.paypal.com', // Live Api
    port: '',
    client_id: '<-YOUR-PAYPAL-CLIENT-ID->',
    client_secret: '<-YOUR-PAYPAL-CLIENT-SECRET->',
    routes: {
      payment: '/v1/payments/payment',
      payouts: '/v1/payments/payouts',
      execute: '/execute/',
      oauth: '/v1/oauth2/token'
    }
  },
  payouts: {
    emailSubject: 'You have a payment',
    batchMode: false // TODO
  }
};
// indicate what data needs to be loaded
// for this extension
// TODO more documentation
const preLoad = [
  {
    isLoaded: isLoaded,
    function: loadUserPayment,
    // needs, indicate what type of reducer is needed
    needs: 'user',
    // scope, indicates the scope a user should have
    // in order to load this extenion's data
    scopes: [ 'user' ]
  }
];
// functions for clearing out any extension data
// eg: when a user logs out
const clearData = [
  {
    isLoaded: isLoaded,
    function: clearPaymentData,
    needs: 'user',
    scopes: [ 'user' ]
  }
];

export { clearData };
export { preLoad };

export default config;
