import React from 'react';

const Layout = React.createClass({

  render() {
    return (
      <div id='layout'>
        This is the Layout
         {this.props.children}
      </div>
    );
  }
});

export default Layout;