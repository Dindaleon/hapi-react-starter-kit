export const INCREMENT_COUNTER_EXTENSION = 'INCREMENT_COUNTER_EXTENSION';
export const DECREMENT_COUNTER_EXTENSION = 'DECREMENT_COUNTER_EXTENSION';

export function increment() {
  return {
    type: INCREMENT_COUNTER_EXTENSION
  };
}

export function decrement() {
  return {
    type: DECREMENT_COUNTER_EXTENSION
  };
}

export function incrementIfOdd() {
  return (dispatch, getState) => {
    const { counterExtension } = getState();

    if (counterExtension % 2 === 0) {
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
