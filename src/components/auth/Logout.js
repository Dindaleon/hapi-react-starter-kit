import React, { Component, PropTypes } from 'react';
import { StyleRoot } from 'radium';
import { defineMessages, FormattedMessage } from 'react-intl';
import { getCookie, deleteCookie } from '../../helpers/cookieTools';
import { cleanRoomsList } from '../../actions/roomsActions';
import config from '../../config';
import Theme from '../../themes';

const messages = defineMessages({
  logoutButton: {
    id: 'auth.logoutButton',
    description: 'Logout button',
    defaultMessage: 'Logout'
  }
});

class Logout extends Component {
  handleLogout = () => {
    const { dispatch, logout, sessionId, loadLocale, setLocale, pushState } = this.props;
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
      // Clean reducers
      dispatch(cleanRoomsList);
      pushState(null, '/');
      return 'Logout Message.';
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
  dispatch: PropTypes.func.isRequired,
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
