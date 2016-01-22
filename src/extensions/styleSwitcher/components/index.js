import React, { Component, PropTypes } from 'react';

class SwitchTheme extends Component {
  handleLocaleOnChange = event => {
    event.preventDefault();
    this.props.switchTheme(event.target.value);
  };

  render() {
    return (
      <div id="switchTheme">
      style Switcher { ' ' }
      {/* TODO: Convert to array of available themes*/}
          <select value={ this.props.currentTheme } onChange={ this.handleLocaleOnChange }>
            <option value="default">Default</option>
            <option value="alternative">Alternative</option>
          </select>
      </div>
    );
  }
}

SwitchTheme.propTypes = {
  currentTheme: PropTypes.string,
  switchTheme: PropTypes.func
};

export default SwitchTheme;
