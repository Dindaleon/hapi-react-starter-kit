import React, { Component, PropTypes } from 'react';
import radium, { StyleRoot } from 'radium';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import Theme from '../themes';
import customRequire from '../helpers/customRequire';

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
// TODO improve loading of menu items
// by using reducers
class Menu extends Component {
  // get active extensions
  // check those who have menus
  // loop through them
  // push menu items
  loggedInMenuItems = _extendedItems => {
    let extendedItems = [];
    const { formatMessage } = this.props.intl;
    const loggedInMenuItems = [
      { text: formatMessage(messages.menuIndexButton), to: '/' },
      { text: formatMessage(messages.menuHomeButton), to: '/home' },
      { text: formatMessage(messages.menuRoomsButton), to: '/hall' },
      { text: formatMessage(messages.menuDashboardButton), to: '/dashboard' }
    ];
    if ( _extendedItems && _extendedItems.constructor === Array ) {
      extendedItems = _extendedItems;
      for ( const menuItem of extendedItems ) {
        loggedInMenuItems.push(menuItem);
      }
    }
    return loggedInMenuItems;
  };
  loggedOutMenuItems = _extendedItems => {
    let extendedItems = [];
    const { formatMessage } = this.props.intl;
    const loggedOutMenuItems = [
      { text: formatMessage(messages.menuIndexButton), to: '/' },
      { text: formatMessage(messages.menuHomeButton), to: '/home' },
      { text: formatMessage(messages.menuLoginButton), to: '/login' },
      { text: formatMessage(messages.menuSignupButton), to: '/register' }
    ];
    if ( _extendedItems && _extendedItems.constructor === Array ) {
      extendedItems = _extendedItems;
      for ( const menuItem of extendedItems ) {
        loggedOutMenuItems.push(menuItem);
      }
    }
    return loggedOutMenuItems;
  };

  loadMenuItemsFromExtensions(loggedIn) {
    const { formatMessage } = this.props.intl;
    const { extensions } = this.props;
    let currentExtension = null;
    let menuItems = [];
    const loggedInItems = [];
    const loggedOutItems = [];
    for ( const extension of extensions.enabled ) {
      try {
        currentExtension = customRequire('/' + extension.folderName + '/lang/index');
        if (currentExtension.menu) {
          for (const menuItem of currentExtension.menu) {
            if (menuItem.translated) {
              try {
                menuItem.text = formatMessage(currentExtension.messages[menuItem.translated]);
              } catch (e) {
                console.error('Translated message for menu item "' + menuItem.text + '" is not defined.');
              }
            }
            for (const scope of menuItem.scopes) {
              if (scope === 'user') {
                // Add item to loggedInMenuItems
                loggedInItems.push({ text: menuItem.text, to: menuItem.to });
              } else {
                // Add item to loggedOutMenuItems
                loggedOutItems.push({ text: menuItem.text, to: menuItem.to });
              }
            }
          }
        }
      } catch (e) {
        // console.log('This extension does not contain a menu.')
      }
    }
    if (loggedIn) {
      menuItems = this.loggedInMenuItems(loggedInItems);
    } else {
      menuItems = this.loggedOutMenuItems(loggedOutItems);
    }
    return menuItems;
  };

  render() {
    const { pushState, router, sessionId } = this.props;

    let items = this.loadMenuItemsFromExtensions(false);
    if (sessionId) {
      items = this.loadMenuItemsFromExtensions(true);
    }

    return (
      <StyleRoot>
        <Theme render="Tab" items={ items } pushState={ pushState } router={ router } />
      </StyleRoot>
    );
  }
}

Menu.propTypes = {
  extensions: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  pushState: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
  sessionId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired
};

export default radium(injectIntl(Menu));
