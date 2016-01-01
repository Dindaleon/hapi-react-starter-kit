import React, { Component, PropTypes } from 'react';
import Signup from '../components/auth/Signup';

export default class SignupPage extends Component {
  render() {
    const { register, login, loadLocale, pushState } = this.props.children;
    return (
      <div id="SignupPage">
        Please Signup:
        <Signup
          register={ register }
          login={ login }
          loadLocale={ loadLocale }
          pushState={ pushState } />
      </div>
    );
  }
}

SignupPage.propTypes = {
  children: PropTypes.object
};
