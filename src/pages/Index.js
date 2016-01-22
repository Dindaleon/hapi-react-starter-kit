import React, { Component } from 'react';
import radium, { StyleRoot } from 'radium';
import { Link } from 'react-router';
import { defineMessages, FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';
import Theme from '../themes';

const messages = defineMessages({
  welcomeMessage: {
    id: 'index.helloWorld',
    description: 'Welcome message for a user or guest',
    defaultMessage: 'Hello World!'
  },
  takeMeHome: {
    id: 'index.takeMeHome',
    description: 'Message for LINK button take me home',
    defaultMessage: 'Take me home...'
  }
});

class Index extends Component {
  render() {
    return (
      <StyleRoot id="index">
        <Helmet title="Index" />
        <div>
          <FormattedMessage { ...messages.welcomeMessage } />
        </div>
        <Link to={ '/home' }>
          <Theme render="Button">
            <FormattedMessage { ...messages.takeMeHome } />
          </Theme>
        </Link>
      </StyleRoot>
    );
  }
}

export default radium( Index );
