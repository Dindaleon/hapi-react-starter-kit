const initialState = 0;

const counterExtension = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT_COUNTER_EXTENSION':
      return state + 1;
    case 'DECREMENT_COUNTER_EXTENSION':
      return state - 1;
    default:
      return state;
  }
};

export default counterExtension;
