import React, { Component, PropTypes } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { setCookie } from '../../helpers/cookieTools';
import config from '../../config';
import Theme from '../../themes';
import loadExtensionsData from '../../helpers/loadExtensionsData';

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
    loggedIn: false,
    resultMessage: ''
  };

  handleChangeRegisterFields(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleRegister = event => {
    event.preventDefault();

    const {
      dispatch,
      register,
      login,
      loadLocale,
      pushState,
      setAllExtensionsDataLoaded
    } = this.props;
    const username = this.state.username || null;
    const password = this.state.password || null;
    const email = this.state.email || null;
    if (username === null) {
      return this.setState({ resultMessage: 'Must enter a username.' });
    }

    if (password === null) {
      return this.setState({ resultMessage: 'Must enter a password.' });
    }

    if (email === null) {
      return this.setState({ resultMessage: 'Must enter an email.' });
    }

    return register( username, password, email )
    .then( action => {
      if ( typeof action.result !== 'undefined' ) {
        loadLocale(action.result.data.locale || config.user.locale);
        // Log the user in ig registration is successful
        return login( action.result.data.username, action.result.data.password )
        .then( action => {
          // TODO user levels/scopes
          return loadExtensionsData(this.props.globalState, dispatch)
          .then( () => {
            setAllExtensionsDataLoaded(true);
            setCookie(
              config.user.session.name, // User session
              action.result.data.encrypted, // encrypted data
              config.user.session.ttls // time to live
            );
            // Redirect user
            const redirectTo = config.user.redirectOnRegister || 'dashboard';
            pushState(null, '/' + redirectTo);
          }).catch( e => {
            console.error('ERROR: There was a problem loading extensions\' data.', e.stack);
          });
        });
      }
      // handle signup error
      return this.setState({ resultMessage: 'There was a problem creating a new account.' });
    }).catch( e => {
      console.error('ERROR: There was a problem creating a new account.', e.stack);
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
        <br />
        { this.state.resultMessage }
      </form>
    );
  }

}

Signup.propTypes = {
  dispatch: PropTypes.func.isRequired,
  globalState: PropTypes.object.isRequired,
  loadLocale: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  pushState: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  setAllExtensionsDataLoaded: PropTypes.func.isRequired
};
