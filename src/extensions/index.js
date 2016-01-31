import React, { Component, PropTypes } from 'react';
import EmptyComponent from '../components/EmptyComponent';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return {
    extensions: state.extensions.enabled
  };
};

class RenderExtension extends Component {

  isComponentActive = extensionName => {
    let isActive = false;
    for (const item of this.props.extensions) {
      if ( item.folderName === extensionName ) {
        isActive = true;
        break;
      }
    }
    return isActive;
  };

  render() {
    const customRequire = extensionName => {
      let component = EmptyComponent;
      if (__SERVER__) {
        if (this.isComponentActive(extensionName)) {
          component = require('../extensions/' + extensionName + '/containers/index').default;
        }
      } else {
        const req = require.context('../extensions', true);
        if (this.isComponentActive(extensionName)) {
          component = req('./' + extensionName + '/containers/index').default;
        }
      }
      return component;
    };

    const ExtensionComponent = customRequire(this.props.name);

    return (
      <div>
        <ExtensionComponent { ...this.props } />
      </div>
    );
  }
}

RenderExtension.propTypes = {
  name: PropTypes.string,
  extensions: PropTypes.array.isRequired
};

export default connect( mapStateToProps)( RenderExtension );
