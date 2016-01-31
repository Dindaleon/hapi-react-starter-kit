import { LOAD_LOCALE } from '../actions/localeActions';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/lib/locale-data/en';
import es from 'react-intl/lib/locale-data/es';

addLocaleData(en);
addLocaleData(es);

const initialState = {
  loadedLocale: false,
  messages: ''
};

module.exports = {
  extended: (activeExtensions) => {
    const lang = require('../lang').extended(activeExtensions);

    const i18l = ( state = initialState, action = {} ) => {
      switch (action.type) {
        case LOAD_LOCALE: {
          return {
            ...state,
            loadedLocale: true,
            messages: lang[action.locale]
          };
        }
        default: {
          return state;
        }
      }
    };
    return i18l;
  }
};
