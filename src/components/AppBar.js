import React, { Component } from 'react';
import Theme from '../themes';

class Bar extends Component {
  state = {};

  render() {
    return (
      <Theme render="AppBar" { ...this.props } />
    );
  }
}

export default Bar;
