import React, { Component, PropTypes } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Logout from './auth/Logout';
import SwitchLocale from './Locale';
import RenderExtension from '../extensions';
import AppBar from './AppBar';
import Menu from './Menu';
import config from '../config';
// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();
class Layout extends Component {
  render() {
    const { dispatch, router, user, logout, loadLocale, setLocale, pushState } = this.props;
    const childrenProps = this.props;
    const childrenWithProps = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, { 'children': childrenProps });
    });
    return (
      <div id="layout">
        <AppBar title={ { text: config.app.title, to: '/' } } />
        <Menu sessionId={ user.sessionId } pushState={ pushState } router={ router } />
        <br />
        SESSIONID: { user.sessionId ? user.sessionId : 'null' }
        <br />
        YOUR COORDINATES: { 'LAT:' + user.coordinates.latitude + ' LNG:' + user.coordinates.longitude }
        <SwitchLocale { ...this.props } />
        <RenderExtension name="styleSwitcher" />
        { user.sessionId ?
          <Logout
            dispatch={ dispatch }
            sessionId={ user.sessionId }
            logout={ logout }
            loadLocale={ loadLocale }
            setLocale={ setLocale }
            pushState={ pushState } /> : ''
        }

        { /* this.props.children */}
        { childrenWithProps }

      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  loadLocale: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  pushState: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
  setLocale: PropTypes.func.isRequired,
  switchLocale: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

export default Layout;
