import React, { Component } from 'react';
import { AppBar } from '../themes';

class Bar extends Component {
  state = {}

  render() {
    return (
        <AppBar { ...this.props } />
    );
  }
}

export default Bar;
