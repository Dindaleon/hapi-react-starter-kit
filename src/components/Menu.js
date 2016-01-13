import React, { Component, PropTypes } from 'react';
import radium, { StyleRoot } from 'radium';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { Tab } from '../themes';

const messages = defineMessages({
  menuIndexButton: {
    id: 'menuItem.index',
    description: 'Index Menu button',
    defaultMessage: 'Index'
  },
  menuHomeButton: {
    id: 'menuItem.home',
    description: 'Home Menu button',
    defaultMessage: 'Home'
  },
  menuRoomsButton: {
    id: 'menuItem.rooms',
    description: 'Rooms Menu button',
    defaultMessage: 'Rooms'
  },
  menuDashboardButton: {
    id: 'menuItem.dashboard',
    description: 'Dashboard Menu button',
    defaultMessage: 'Dashboard'
  },
  menuLoginButton: {
    id: 'menuItem.login',
    description: 'Login Menu button',
    defaultMessage: 'Login'
  },
  menuSignupButton: {
    id: 'menuItem.signup',
    description: 'Signup Menu button',
    defaultMessage: 'Register'
  }
});

class Menu extends Component {
  render() {
    const { pushState, router, sessionId } = this.props;
    const { formatMessage } = this.props.intl;
    const loggedInMenuItems = [
      { text: formatMessage(messages.menuIndexButton), to: '/' },
      { text: formatMessage(messages.menuHomeButton), to: '/home' },
      { text: formatMessage(messages.menuRoomsButton), to: '/hall' },
      { text: formatMessage(messages.menuDashboardButton), to: '/dashboard' }
    ];
    const loggedOutMenuItems = [
      { text: formatMessage(messages.menuIndexButton), to: '/' },
      { text: formatMessage(messages.menuHomeButton), to: '/home' },
      { text: formatMessage(messages.menuLoginButton), to: '/login' },
      { text: formatMessage(messages.menuSignupButton), to: '/register' },
    ];
    let items = loggedOutMenuItems;
    if (sessionId) {
      items = loggedInMenuItems;
    }
    return (
      <StyleRoot>
        <Tab items={ items } pushState={ pushState } router={ router } />
      </StyleRoot>
    );
  }
}

Menu.propTypes = {
  intl: intlShape.isRequired,
  pushState: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
  sessionId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired
};

export default radium(injectIntl(Menu));
