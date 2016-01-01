import React, { Component, PropTypes } from 'react';
import Login from '../components/auth/Login';

export default class LoginPage extends Component {
  render() {
    const { login, loadLocale, pushState } = this.props.children;
    return (
      <div id="LoginPage">
        Please Login:
        <Login
          login={ login }
          loadLocale={ loadLocale }
          pushState={ pushState } />
      </div>
    );
  }
}

LoginPage.propTypes = {
  children: PropTypes.object
};
