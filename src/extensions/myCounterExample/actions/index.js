export const INCREMENT_COUNTER_EXAMPLE = 'INCREMENT_COUNTER_EXAMPLE';
export const DECREMENT_COUNTER_EXAMPLE = 'DECREMENT_COUNTER_EXAMPLE';

export function increment() {
  return {
    type: INCREMENT_COUNTER_EXAMPLE
  };
}

export function decrement() {
  return {
    type: DECREMENT_COUNTER_EXAMPLE
  };
}

export function incrementIfOdd() {
  return (dispatch, getState) => {
    const { myCounterExample } = getState();

    if (myCounterExample % 2 === 0) {
      return;
    }

    dispatch(increment());
  };
}

export function incrementAsync(delay = 1000) {
  return dispatch => {
    setTimeout(() => {
      dispatch(increment());
    }, delay);
  };
}
