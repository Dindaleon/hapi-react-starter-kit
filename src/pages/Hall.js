import React, { Component } from 'react';
import { StyleRoot } from 'radium';
import Hall from '../containers/HallContainer';

export default class HallPage extends Component {
  render() {
    return (
      <StyleRoot id="hall">
        <h1>The Hall</h1>
        <Hall />
      </StyleRoot>
    );
  }
}
