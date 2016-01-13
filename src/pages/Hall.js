import React, { Component } from 'react';
import { StyleRoot } from 'radium';
import Helmet from 'react-helmet';
import Hall from '../containers/HallContainer';

export default class HallPage extends Component {
  render() {
    return (
      <StyleRoot id="hall">
        <Helmet title="The Hall" />
        <h1>The Hall</h1>
        <Hall />
      </StyleRoot>
    );
  }
}
