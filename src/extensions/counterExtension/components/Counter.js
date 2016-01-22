import React, { Component, PropTypes } from 'react';

class Counter extends Component {
  render() {
    const { increment, incrementIfOdd, incrementAsync, decrement, counterExtension } = this.props;
    return (
      <div id="counter-example">
        Clicked: { counterExtension } times
        { ' ' }
        <button onClick={ increment }>+</button>
        { ' ' }
        <button onClick={ decrement }>-</button>
        { ' ' }
        <button onClick={ incrementIfOdd }>Increment if odd</button>
        { ' ' }
        <button onClick={ () => incrementAsync() }>Increment async</button>
      </div>
    );
  }
}

Counter.propTypes = {
  increment: PropTypes.func.isRequired,
  incrementIfOdd: PropTypes.func.isRequired,
  incrementAsync: PropTypes.func.isRequired,
  decrement: PropTypes.func.isRequired,
  counterExtension: PropTypes.number
};

export default Counter;
