const logger = store => next => action => {
  const result = next(action);

  if (__SERVER__) {
    return result;
  }

  if (typeof( console.group ) === 'function') {
    console.group('action.type');
  }
  console.info('dispatching', action);

  console.log('next state', store.getState());

  if (typeof( console.groupEnd ) === 'function') {
    console.groupEnd('action.type');
  }

  return result;
};

export default logger;
