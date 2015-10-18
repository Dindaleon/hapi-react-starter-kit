import React, { PropTypes } from 'react';

const Layout = React.createClass({

  propTypes: {
    children: PropTypes.object.isRequired
  },

  render() {
    return (
      <div id="layout">
        This is the Layout
        { this.props.children }
      </div>
    );
  }
});

export default Layout;
