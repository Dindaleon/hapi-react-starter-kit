import React, { Component, PropTypes } from 'react';
import { StyleRoot } from 'radium';
import { defineMessages, FormattedMessage } from 'react-intl';
import { getCookie, deleteCookie } from '../../helpers/cookieTools';
import config from '../../config';
import Theme from '../../themes';
import clearExtensionsData from '../../helpers/clearExtensionsData';

const messages = defineMessages({
  logoutButton: {
    id: 'auth.logoutButton',
    description: 'Logout button',
    defaultMessage: 'Logout'
  }
});

class Logout extends Component {
  handleLogout = () => {
    const {
      cleanRoomsList,
      dispatch,
      setAllExtensionsDataLoaded,
      setAllExtensionsDataCleared,
      logout,
      sessionId,
      loadLocale,
      setLocale,
      pushState
    } = this.props;
    logout(sessionId)
    .then(() => {
      if (getCookie(config.user.session.name)) {
        deleteCookie(config.user.session.name);
      }
      if (window.localStorage && localStorage.locale) {
        loadLocale(localStorage.locale);
        setLocale(localStorage.locale);
      } else {
        // Set default locale after logout
        loadLocale(config.user.locale);
      }
      // Clear all extensions data
      return clearExtensionsData(this.props.globalState, dispatch)
      .then( () => {
        setAllExtensionsDataLoaded(false);
        setAllExtensionsDataCleared(true);
        // Clean reducers
        cleanRoomsList();
        pushState(null, '/');
      }).catch( e => {
        console.error('ERROR: There was a problem clearing out extensions\' data.', e.stack);
      });
    });
  };
  render() {
    return (
      <StyleRoot>
        <Theme render="Button" type="submit" onClick={ ::this.handleLogout } ><FormattedMessage { ...messages.logoutButton } /></Theme>
      </StyleRoot>
    );
  }
}

Logout.propTypes = {
  cleanRoomsList: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  setAllExtensionsDataLoaded: PropTypes.func.isRequired,
  setAllExtensionsDataCleared: PropTypes.func.isRequired,
  globalState: PropTypes.object.isRequired,
  loadLocale: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  pushState: PropTypes.func.isRequired,
  sessionId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  setLocale: PropTypes.func.isRequired
};

export default Logout;
