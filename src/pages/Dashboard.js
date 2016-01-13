import React, { Component } from 'react';
import { StyleRoot } from 'radium';
import Dashboard from '../containers/DashboardContainer';
import Helmet from 'react-helmet';
export default class DashboardPage extends Component {
  render() {
    return (
      <StyleRoot id="dashboard">
        <Helmet title="The Dashboard" />
        <h1>Dashboard</h1>
        <Dashboard />
      </StyleRoot>
    );
  }
}
