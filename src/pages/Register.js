import React, { Component, PropTypes } from 'react';
import { StyleRoot } from 'radium';
import Helmet from 'react-helmet';
import Signup from '../components/auth/Signup';

export default class SignupPage extends Component {
  render() {
    const {
      dispatch,
      globalState,
      register,
      login,
      loadLocale,
      pushState,
      setAllExtensionsDataLoaded
    } = this.props.children;
    return (
      <StyleRoot id="SignupPage">
        <Helmet title="Create new account" />
        <h1>Please Signup:</h1>
        <Signup
          dispatch={ dispatch }
          globalState={ globalState }
          register={ register }
          login={ login }
          loadLocale={ loadLocale }
          pushState={ pushState }
          setAllExtensionsDataLoaded={ setAllExtensionsDataLoaded } />
      </StyleRoot>
    );
  }
}

SignupPage.propTypes = {
  children: PropTypes.object
};
