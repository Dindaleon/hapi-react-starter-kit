import React, { Component, PropTypes } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { setCookie } from '../../helpers/cookieTools';
import config from '../../config';
import Theme from '../../themes';

const messages = defineMessages({
  passwordText: {
    id: 'global.password',
    description: 'Password text',
    defaultMessage: 'password'
  },
  signupButton: {
    id: 'auth.signupButton',
    description: 'Signup button.',
    defaultMessage: 'Signup'
  },
  usernameText: {
    id: 'global.username',
    description: 'Username text',
    defaultMessage: 'username'
  }
});

export default class Signup extends Component {

  state = {
    userId: 0,
    username: null,
    password: null,
    email: null,
    loggedIn: false
  };

  handleChangeRegisterFields(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleRegister = event => {
    event.preventDefault();

    const { register, login, loadLocale, pushState } = this.props;
    const username = this.state.username || null;
    const password = this.state.password || null;
    const email = this.state.email || null;
    if (username === null) {
      return console.log('Must enter a username.');
    }

    if (password === null) {
      return console.log('Must enter a password.');
    }

    if (email === null) {
      return console.log('Must enter an email.');
    }

    register( username, password, email ).then( action => {
      if ( typeof action.result !== 'undefined' ) {
        // Log the user in ig registration is successful
        login( action.result.data.username, action.result.data.password )
        .then( action => {
          // TO DO locale
          loadLocale(action.result.data.locale || config.user.locale);
          setCookie(
            config.user.session.name, // User session
            action.result.data.encrypted, // encrypted data
            config.user.session.ttls // time to live
          );
          // Redirect user
          const redirectTo = config.user.redirectOnRegister || 'dashboard';
          pushState(null, '/' + redirectTo);
        });
      } else {
        // handle signup error
        console.error('There was a problem logging in.');
      }
    });
  };

  render() {
    return (
      <form onSubmit={ ::this.handleRegister }>
        <Theme render="TextField" type="text" name="username" value={ this.state.username } placeholder="username" onChange={ ::this.handleChangeRegisterFields } />
        <br />
        <Theme render="TextField" type="password" name="password" value={ this.state.password } placeholder="password" onChange={ ::this.handleChangeRegisterFields } />
        <br />
        <Theme render="TextField" type="text" name="email" value={ this.state.email } placeholder="email" onChange={ ::this.handleChangeRegisterFields } />
        <Theme render="Button" type="submit" onClick={ ::this.handleRegister }><FormattedMessage { ...messages.signupButton } /></Theme>
      </form>
    );
  }

}

Signup.propTypes = {
  loadLocale: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  pushState: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired
};
