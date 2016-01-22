import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import path from 'path';
import ThemeBody from './ThemeBody';
import EmptyComponent from '../components/EmptyComponent';

// In case an element does not exist
// fallback to a default one
class Theme extends Component {
  // TODO move customRequire() here.
  // or move it a another file.
  // issue: it wont re-render if updated.
  // solution: update component manually?
  // shouldComponentUpdate?
  render() {
    const componentToRender = this.props.render;

    let customRequire = () => { return 'undefined'; };
    let component = null;
    const defaultTheme = 'default';
    let currentTheme = defaultTheme;
    if ( typeof this.props.styleSwitcher.currentTheme !== 'undefined' ) {
      currentTheme = this.props.styleSwitcher.currentTheme;
    }
    if (__SERVER__) {
      customRequire = (themeName, componentName) => {
        try {
          component = require(path.resolve(__dirname, themeName, componentName + '.js')).default;
        } catch (e) {
          if ( e.code === 'MODULE_NOT_FOUND' ) {
            try {
              console.error('ERROR Component ' + componentName + ' does not exist.');
              component = require('./' + defaultTheme + '/' + componentName + '.js').default;
            } catch (e) {
              console.error('ERROR Component ' + componentName + ' does not exist.');
              component = EmptyComponent;
            }
          } else {
            console.error('ERROR Component ' + componentName + ' does not exist.');
            component = EmptyComponent;
          }
        }
        return component;
      };
    } else {
      customRequire = (themeName, componentName) => {
        const req = require.context('./', true);
        try {
          component = req('./' + themeName + '/' + componentName + '.js').default;
        } catch (e) {
          // e.code returns 'undefined' for MODULE_NOT_FOUND
          try {
            component = req('./' + defaultTheme + '/' + componentName + '.js').default;
          } catch (e) {
            // e.code returns 'undefined' for MODULE_NOT_FOUND
            component = EmptyComponent;
          }
        }

        return component;
      };
    }

    const ThemeComponent = customRequire(currentTheme, componentToRender);

    return (
      <ThemeComponent { ...this.props } />
    );
  }
}

Theme.propTypes = {
  render: PropTypes.string.isRequired,
  styleSwitcher: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    styleSwitcher: state.styleSwitcher
  };
};

export default connect( mapStateToProps )( Theme );

export { ThemeBody };
