import React, { Component, PropTypes } from 'react';
import radium from 'radium';
import { defineMessages, FormattedMessage } from 'react-intl';
import { setCookie } from '../../helpers/cookieTools';
import config from '../../config';
import Theme from '../../themes';

const messages = defineMessages({
  loginButton: {
    id: 'auth.loginButton',
    description: 'Login button.',
    defaultMessage: 'Login'
  }
});

export default class Login extends Component {

  state = {
    userId: 0,
    username: null,
    password: null,
    loggedIn: false
  };

  handleChangeLoginFields = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleLogin = event => {
    event.preventDefault();

    const { login, loadLocale, pushState } = this.props;
    const username = this.state.username || null;
    const password = this.state.password || null;

    if (username === null) {
      return console.log('Must enter a username.');
    }

    if (password === null) {
      return console.log('Must enter a password.');
    }

    login(username, password).then( action => {
      if ( typeof action.result !== 'undefined' ) {
        loadLocale(action.result.data.locale);
        setCookie(
          config.user.session.name, // User session
          action.result.data.encrypted, // encrypted data
          config.user.session.ttls // time to live
        );
        // Redirect user
        const redirectTo = config.user.redirectOnLogin || 'dashboard';
        pushState(null, '/' + redirectTo);
      } else {
        // handle error
        console.error('There was a problem logging in.');
      }
    });
  };

  render() {
    return (
      <form onSubmit={ this.handleLogin }>
        <Theme render="TextField" type="text" name="username" value={ this.state.username } placeholder="username" onChange={ this.handleChangeLoginFields } />
        <br />
        <Theme render="TextField" type="password" name="password" value={ this.state.password } placeholder="password" onChange={ this.handleChangeLoginFields } />
        <Theme render="Button" color="accent" onClick={ this.handleLogin }>
          <FormattedMessage { ...messages.loginButton } />
        </Theme>
      </form>
    );
  }
}

Login.propTypes = {
  loadLocale: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  pushState: PropTypes.func.isRequired
};

export default radium(Login);
