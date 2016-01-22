import React, { Component, PropTypes } from 'react';
import { StyleRoot } from 'radium';
import Button from '../themes/default/Button';

class Counter extends Component {
  render() {
    const { increment, incrementIfOdd, incrementAsync, decrement, counter } = this.props;
    return (
      <StyleRoot id="counter-example">
        Clicked: { counter } times
        { ' ' }
        <Button onClick={ increment }>+</Button>
        { ' ' }
        <Button onClick={ decrement }>-</Button>
        { ' ' }
        <Button onClick={ incrementIfOdd }>Increment if odd</Button>
        { ' ' }
        <Button onClick={ () => incrementAsync() }>Increment async</Button>
      </StyleRoot>
    );
  }
}

Counter.propTypes = {
  increment: PropTypes.func.isRequired,
  incrementIfOdd: PropTypes.func.isRequired,
  incrementAsync: PropTypes.func.isRequired,
  decrement: PropTypes.func.isRequired,
  counter: PropTypes.number.isRequired
};

export default Counter;
