const myCounterExample = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT_COUNTER_EXAMPLE':
      return state + 1;
    case 'DECREMENT_COUNTER_EXAMPLE':
      return state - 1;
    default:
      return state;
  }
};

export default myCounterExample;
