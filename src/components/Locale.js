import React, { Component, PropTypes } from 'react';

export default class Locale extends Component {
  // Change locale on user input
  handleLocaleOnChange = event => {
    const user = {
      accessToken: this.props.user.accessToken,
      id: this.props.user.id,
      locale: event.target.value
    };
    if ( user.id === 0 ) {
      this.props.loadLocale(user.locale);
      this.props.setLocale(user.locale);
      if (window.localStorage) {
        localStorage.setItem('locale', user.locale);
      }
    } else {
      this.props.switchLocale( user, true ).then(() => {
        this.props.loadLocale(user.locale);
      });
    }
  };

  render() {
    return (
      <div id="switchLocale">
        user locale is { ' ' }
      {/* TODO: Convert to array of available languages */}
          <select value={ this.props.user.locale } onChange={ this.handleLocaleOnChange }>
            <option value="es">Spanish</option>
            <option value="en">English</option>
            <option value="it">Italian</option>
          </select>
      </div>
    );
  }
}

Locale.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]).isRequired,
  loadLocale: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  pushState: PropTypes.func.isRequired,
  setLocale: PropTypes.func.isRequired,
  switchLocale: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};
