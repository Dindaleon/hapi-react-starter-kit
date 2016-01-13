import React, { Component, PropTypes } from 'react';
import { StyleRoot } from 'radium';
import Helmet from 'react-helmet';
import Signup from '../components/auth/Signup';

export default class SignupPage extends Component {
  render() {
    const { register, login, loadLocale, pushState } = this.props.children;
    return (
      <StyleRoot id="SignupPage">
        <Helmet title="Create new account" />
        <h1>Please Signup:</h1>
        <Signup
          register={ register }
          login={ login }
          loadLocale={ loadLocale }
          pushState={ pushState } />
      </StyleRoot>
    );
  }
}

SignupPage.propTypes = {
  children: PropTypes.object
};
