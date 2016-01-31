const pages = [
  {
    path: 'payments/create',
    component: require('./create').default,
    scope: 'registered' // public, private, loggedOut
  },
  {
    path: 'payments/payout',
    component: require('./payout').default,
    scope: 'registered' // public, private, loggedOut
  },
  {
    path: 'payments/approved/amount/:amount',
    component: require('./approved').default,
    scope: 'registered' // public, private, loggedOut
  },
  {
    path: 'payments/cancel',
    component: require('./cancel').default,
    scope: 'registered' // public, private, loggedOut
  }
];

export default pages;
