import React, { Component, PropTypes } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { getCookie, deleteCookie } from '../../helpers/cookieTools';
import config from '../../config';

const messages = defineMessages({
  logoutButton: {
    id: 'auth.logoutButton',
    description: 'Logout button',
    defaultMessage: 'Logout'
  }
});

export default class Logout extends Component {
  handleLogout = () => {
    const { logout, sessionId, loadLocale, setLocale, pushState } = this.props;
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
      pushState(null, '/');
    });
  }
  render() {
   /* const logoutText = this.props.i18l.messages ?
                       this.props.i18l.messages['auth.logout'] :
                       messages.logout.defaultMessage;*/
    return (
      <button type="submit" onClick={ ::this.handleLogout } ><FormattedMessage { ...messages.logoutButton } /></button>
    );
  }
}

Logout.propTypes = {
  loadLocale: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  pushState: PropTypes.func.isRequired,
  sessionId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  setLocale: PropTypes.func.isRequired
};
