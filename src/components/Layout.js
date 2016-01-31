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
    const {
      cleanRoomsList,
      dispatch,
      setAllExtensionsDataCleared,
      setAllExtensionsDataLoaded,
      extensions,
      router,
      user,
      logout,
      loadLocale,
      pushState,
      setLocale,
      globalState
    } = this.props;
    const childrenProps = this.props;
    const childrenWithProps = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, { 'children': childrenProps });
    });
    return (
      <div id="layout">
        <AppBar title={ { text: config.app.title, to: '/' } } />
        <Menu extensions={ extensions } sessionId={ user.sessionId } pushState={ pushState } router={ router } />
        <br />
        SESSIONID: { user.sessionId ? user.sessionId : 'null' }
        <br />
        YOUR COORDINATES: { 'LAT:' + user.coordinates.latitude + ' LNG:' + user.coordinates.longitude }
        <SwitchLocale { ...this.props } />
        <RenderExtension name="styleSwitcher" />
        <br />
        <RenderExtension name="paypalPayments" />
        { user.sessionId ?
          <Logout
            cleanRoomsList={ cleanRoomsList }
            dispatch={ dispatch }
            setAllExtensionsDataCleared={ setAllExtensionsDataCleared }
            setAllExtensionsDataLoaded={ setAllExtensionsDataLoaded }
            sessionId={ user.sessionId }
            logout={ logout }
            loadLocale={ loadLocale }
            pushState={ pushState }
            setLocale={ setLocale }
            globalState={ globalState } /> : ''
        }

        { /* this.props.children */}
        { childrenWithProps }

      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]).isRequired,
  cleanRoomsList: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  setAllExtensionsDataCleared: PropTypes.func.isRequired,
  setAllExtensionsDataLoaded: PropTypes.func.isRequired,
  extensions: PropTypes.object.isRequired,
  loadLocale: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  pushState: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
  setLocale: PropTypes.func.isRequired,
  globalState: PropTypes.object.isRequired,
  switchLocale: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

export default Layout;
