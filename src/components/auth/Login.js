import React, { Component, PropTypes } from 'react';
import radium from 'radium';
import { defineMessages, FormattedMessage } from 'react-intl';
import { setCookie } from '../../helpers/cookieTools';
import config from '../../config';
import Theme from '../../themes';
import loadExtensionsData from '../../helpers/loadExtensionsData';

const messages = defineMessages({
  loginButton: {
    id: 'auth.loginButton',
    description: 'Login button.',
    defaultMessage: 'Login'
  }
});

class Login extends Component {

  state = {
    userId: 0,
    username: null,
    password: null,
    loggedIn: false,
    resultMessage: ''
  };

  handleChangeLoginFields = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleLogin = event => {
    event.preventDefault();
    const {
      dispatch,
      setAllExtensionsDataLoaded,
      loadLocale,
      login,
      pushState
    } = this.props;
    const username = this.state.username || null;
    const password = this.state.password || null;

    if (username === null) {
      return this.setState({ resultMessage: 'Must enter a username.' });
    }

    if (password === null) {
      return this.setState({ resultMessage: 'Must enter a password.' });
    }
    login(username, password)
    .then( action => {
      if ( typeof action.result !== 'undefined' ) {
        loadLocale(action.result.data.locale);
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
          const redirectTo = config.user.redirectOnLogin || 'dashboard';
          pushState(null, '/' + redirectTo);
        }).catch( e => {
          console.error('ERROR: There was a problem loading extensions\' data.', e.stack);
        });
      }
      // handle error
      return this.setState({ resultMessage: 'There was a problem logging in.' });
    }).catch( e => {
      console.error('ERROR: There was a problem logging in.', e.stack);
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
        <br />
        { this.state.resultMessage }
      </form>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  globalState: PropTypes.object.isRequired,
  loadLocale: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  pushState: PropTypes.func.isRequired,
  setAllExtensionsDataLoaded: PropTypes.func.isRequired
};

export default radium(Login);
