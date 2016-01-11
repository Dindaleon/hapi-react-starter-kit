import React, { Component, PropTypes } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Logout from './auth/Logout';
import SwitchLocale from './Locale';
import Menu from './Menu';

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();
class Layout extends Component {
  render() {
    const { user, logout, loadLocale, setLocale, pushState } = this.props;
    const childrenProps = this.props;
    const childrenWithProps = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, { 'children': childrenProps });
    });
    return (
      <div id="layout">
        <span className="mdl-layout-title">Hapi React SK</span>
        <br />
        SESSIONID: { user.sessionId ? user.sessionId : 'null' }
        YOUR COORDINATES: { 'LAT:' + user.coordinates.latitude + ' LNG:' + user.coordinates.longitude }
        <SwitchLocale { ...this.props } />
        { user.sessionId ?
          <Logout
            sessionId={ user.sessionId }
            logout={ logout }
            loadLocale={ loadLocale }
            setLocale={ setLocale }
            pushState={ pushState } /> : ''
        }

        <Menu />

        { /* this.props.children */}
        { childrenWithProps }

      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.object.isRequired,
  loadLocale: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  pushState: PropTypes.func.isRequired,
  setLocale: PropTypes.func.isRequired,
  switchLocale: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

export default Layout;
