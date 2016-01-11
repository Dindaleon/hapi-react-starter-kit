import React, { Component } from 'react';
import { StyleRoot } from 'radium';
import Dashboard from '../containers/DashboardContainer';

export default class DashboardPage extends Component {
  render() {
    return (
      <StyleRoot id="dashboard">
        <h1>Dashboard</h1>
        <Dashboard />
      </StyleRoot>
    );
  }
}
