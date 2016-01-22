import React, { Component, PropTypes } from 'react';

class Counter extends Component {
  render() {
    const { login, logout, isLoggedIn } = this.props;
    return (
      <p>
        is logged in? { isLoggedIn ? 'TRUE' : 'FALSE' }
        { ' ' }
        <button onClick = { login }>Login</button>
        <button onClick = { logout }>Logout</button>
      </p>
    );
  }
}

Counter.propTypes = {
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.object.isRequired
};

export default Counter;
