import { defineMessages } from 'react-intl';
import es from './es';
import it from './it';
const languages = [
  {
    locale: 'es',
    file: es
  },
  {
    locale: 'it',
    file: it
  }
];

const menu = [
  {
    text: 'Deposit',
    to: '/payments/create',
    scopes: [ 'user' ],
    translated: 'menuPaymentCreate'
  },
  {
    text: 'Payout',
    to: '/payments/payout',
    scopes: [ 'user' ],
    translated: 'menuPaymentPayout'
  }
];

const messages = defineMessages({
  menuPaymentCreate: {
    id: 'menuItem.paymentCreate',
    description: 'Create a new payment button',
    defaultMessage: menu[0].text
  },
  menuPaymentPayout: {
    id: 'menuItem.paymentPayout',
    description: 'Create a new payment payout button',
    defaultMessage: menu[1].text
  }
});

export { menu };
export { messages };
export default languages;
