import React, { Component, PropTypes } from 'react';
import Promise from 'bluebird';
import Layout from '../components/Layout';
import { load, isAuthLoaded } from '../actions/userActions';
import { loadLocale } from '../actions/localeActions';
import connectData from '../helpers/connectData';

import config from '../config';

const fetchData = (getState, dispatch) => {
  const promises = [];

  if (!isAuthLoaded(getState())) {
    promises.push(dispatch(load()).then(() => {
      const user = getState().user.data;
      if ( user.id === 0 ) {
        // Set default locale for logged out users
        user.locale = config.user.locale;
      }
      // Load user/guest locale
      promises.push(dispatch(loadLocale(user.locale)));
    }));
  }
  return Promise.all(promises);
};

@connectData( fetchData )
export default class App extends Component {
  componentDidMount() {
    const { loadLocale, setLocale, user } = this.props;
    // Load saved locale for guests
    if ( user.id === 0 && localStorage.locale ) {
      const locale = localStorage.locale;
      loadLocale(locale);
      setLocale(locale);
    }
  }
  render() {
    return (
			<Layout {...this.props} />
		);
  }
}

App.propTypes = {
  loadLocale: PropTypes.func.isRequired,
  setLocale: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};
