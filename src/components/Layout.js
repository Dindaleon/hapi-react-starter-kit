import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Logout from './auth/Logout';
import SwitchLocale from './Locale';
export default class Layout extends Component {

  render() {
    const { user, logout, loadLocale, setLocale, pushState } = this.props;
    const childrenProps = this.props;
    const childrenWithProps = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, { 'children': childrenProps });
    });
    return (
      <div id="layout">
        This is the Layout
        <br />
        SESSIONID: { user.sessionId ? user.sessionId : 'null' }
        <br />
        <SwitchLocale { ...this.props } />
        <br />
        { user.sessionId ? <Logout
                              sessionId={ user.sessionId }
                              logout={ logout }
                              loadLocale={ loadLocale }
                              setLocale={ setLocale }
                              pushState={ pushState } /> : ''
        }
        { /* this.props.children */}
        { childrenWithProps }

        <Link to={ '/' } > Go Index </Link>
        <Link to={ '/home' } > Go home </Link>
        <Link to={ '/login' } > Login </Link>
        <Link to={ '/register' } > Register </Link>
        <Link to={ '/hall' } > Rooms </Link>
        <Link to={ '/dashboard' } > Dashboard </Link>
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
