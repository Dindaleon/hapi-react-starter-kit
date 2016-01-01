import fetch from 'isomorphic-fetch';
import Promise from 'bluebird';
Promise.promisifyAll(fetch);

export const LOAD_LOCALE = 'LOAD_LOCALE';

export const loadLocale = ( locale ) => {
  return {
    type: LOAD_LOCALE,
    locale
  };
};

export const isLocaleLoaded = ( globalState ) => {
  return globalState.locale && globalState.locale.loaded;
};
