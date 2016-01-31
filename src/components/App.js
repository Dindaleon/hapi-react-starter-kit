import React, { Component, PropTypes } from 'react';
import { StyleRoot } from 'radium';
import Promise from 'bluebird';
import Helmet from 'react-helmet';
import Layout from '../components/Layout';
import {
  load,
  isAuthLoaded
} from '../actions/userActions';
import { loadLocale } from '../actions/localeActions';
import {
  allExtensionsDataLoaded,
  allExtensionsDataCleared,
  setAllExtensionsDataLoaded
} from '../actions/extensionsActions';
import connectData from '../helpers/connectData';
import loadExtensionsData from '../helpers/loadExtensionsData';
import { ThemeBody } from '../themes';
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

const fetchDataDeferred = (getState, dispatch) => {
  // Here we load all the required data for the extensions
  if (!allExtensionsDataLoaded(getState()) && !allExtensionsDataCleared(getState())) {
    return loadExtensionsData(getState(), dispatch)
    .then( () => {
      dispatch(setAllExtensionsDataLoaded(true));
    });
  }
};

@connectData( fetchData, fetchDataDeferred )
class App extends Component {
  state = {
    watchId: 0
  };

  componentDidMount() {
    // Locale Control
    const { loadLocale, setLocale, user } = this.props;
    // Load saved locale for guests
    if ( user.id === 0 && localStorage.locale ) {
      const locale = localStorage.locale;
      loadLocale(locale);
      setLocale(locale);
    }
        // Geolocation Control
    this.geolocation = navigator.geolocation || false;
    let geolocation = this.geolocation;
    if (geolocation) {
      geolocation = navigator.geolocation;
      this.watchId = geolocation.watchPosition(this.geoSuccess, this.geoError);
    }
  }

  componentWillUnmount() {
    if (this.geolocation && this.state.watchId > 0) {
      this.geolocation.clearWatch(this.state.watchId);
    }
  }

  geoSuccess = position => {
    const coordinates = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
    this.props.setCoordinates(coordinates);
    this.setState({ watchId: this.watchId });
  };

  geoError = () => {
    console.log('Sorry, geolocation is not available.');
  };

  render() {
    const { userAgent } = this.props;
    return (
      <StyleRoot radiumConfig={{ userAgent }}>
        <ThemeBody render="body" />
          <Helmet {...config.app.head} />
			    <Layout {...this.props} />
      </StyleRoot>
		);
  }
}

App.propTypes = {
  loadLocale: PropTypes.func.isRequired,
  setCoordinates: PropTypes.func.isRequired,
  setLocale: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  userAgent: PropTypes.string.isRequired
};

export default App;
