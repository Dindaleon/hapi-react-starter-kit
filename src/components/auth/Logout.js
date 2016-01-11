import React, { Component, PropTypes } from 'react';
import { StyleRoot } from 'radium';
import { defineMessages, FormattedMessage } from 'react-intl';
import { getCookie, deleteCookie } from '../../helpers/cookieTools';
import config from '../../config';
import Button from '../../themes/default/Button';

const messages = defineMessages({
  logoutButton: {
    id: 'auth.logoutButton',
    description: 'Logout button',
    defaultMessage: 'Logout'
  }
});

class Logout extends Component {
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
      <StyleRoot>
        <Button type="submit" onClick={ ::this.handleLogout } ><FormattedMessage { ...messages.logoutButton } /></Button>
      </StyleRoot>
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

export default Logout;
