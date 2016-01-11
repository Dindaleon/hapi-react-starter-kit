import React, { Component } from 'react';
import { StyleRoot } from 'radium';
import Tab from '../themes/default/Tab';

export default class Menu extends Component {
  state = {
    menuItems: [
      { text: 'Index', to: '' },
      { text: 'Home', to: 'home' },
      { text: 'Login', to: 'login' },
      { text: 'Register', to: 'register' },
      { text: 'Rooms', to: 'hall' },
      { text: 'Dashboard', to: 'dashboard' }
    ]
  }
  render() {
    return (
      <StyleRoot>
        <Tab items={ this.state.menuItems } />
      </StyleRoot>
    );
  }
}
