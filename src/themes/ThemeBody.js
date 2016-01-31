import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Style } from 'radium';

class ThemeBody extends Component {
  // TODO move customRequire() here.
  // or move it a another file.
  // issue: it wont re-render if updated.
  // solution: update component manually?
  // shouldComponentUpdate?

  render() {
    let body = {};
    const defaultTheme = 'default';
    let currentTheme = defaultTheme;
    if ( typeof this.props.styleSwitcher.currentTheme !== 'undefined' ) {
      currentTheme = this.props.styleSwitcher.currentTheme;
    }

    if (__SERVER__) {
      try {
        body = require('./' + currentTheme + '/index.js').body;
      } catch (e) {
        body = require('./' + defaultTheme + '/index.js').body;
      }
    } else {
      const req = require.context('./', true);
      try {
        body = req('./' + currentTheme + '/index.js').body;
      } catch (e) {
        body = req('./' + defaultTheme + '/index.js').body;
      }
    }

    return (
      <Style { ...body } />
    );
  }
}

ThemeBody.propTypes = {
  styleSwitcher: PropTypes.object
};

const mapStateToProps = ( state ) => {
  return {
    styleSwitcher: state.styleSwitcher
  };
};

export default connect( mapStateToProps )( ThemeBody );
