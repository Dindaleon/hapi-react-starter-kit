import React, { Component, PropTypes } from 'react';
import { StyleRoot } from 'radium';
import Login from '../components/auth/Login';

export default class LoginPage extends Component {
  render() {
    const { login, loadLocale, pushState } = this.props.children;
    return (
      <StyleRoot id="LoginPage">
        <h1>Please Login:</h1>
        <Login
          login={ login }
          loadLocale={ loadLocale }
          pushState={ pushState } />
      </StyleRoot>
    );
  }
}

LoginPage.propTypes = {
  children: PropTypes.object
};
