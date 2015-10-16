import React from 'react';
import Layout from './Layout';
const App = React.createClass({

  render() {
    return (
      <Layout {...this.props} />
    );
  }
});

export default App;