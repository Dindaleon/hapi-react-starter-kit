import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import counter from './counter';
import user from './userReducer';
import rooms from './roomsReducer';
import i18l from './localeReducer';

const rootReducer = combineReducers({
  counter,
  user,
  rooms,
  i18l,
  router: routerStateReducer
});

export default rootReducer;
