import React, { Component, PropTypes } from 'react';
import { StyleRoot } from 'radium';
// import Button from '../themes/default/Button';
import Theme from '../../../themes';

class Counter extends Component {
  render() {
    const { increment, incrementIfOdd, incrementAsync, decrement, myCounterExample } = this.props;
    return (
      <StyleRoot id="counter-example">
        Clicked: { myCounterExample } times
        { ' ' }
        <Theme render="Button" onClick={ increment }>+</Theme>
        { ' ' }
        <Theme render="Button" onClick={ decrement }>-</Theme>
        { ' ' }
        <Theme render="Button" onClick={ incrementIfOdd }>Increment if odd</Theme>
        { ' ' }
        <Theme render="Button" onClick={ () => incrementAsync() }>Increment async</Theme>
      </StyleRoot>
    );
  }
}

Counter.propTypes = {
  increment: PropTypes.func.isRequired,
  incrementIfOdd: PropTypes.func.isRequired,
  incrementAsync: PropTypes.func.isRequired,
  decrement: PropTypes.func.isRequired,
  myCounterExample: PropTypes.number.isRequired
};

export default Counter;
