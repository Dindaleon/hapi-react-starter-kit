const isObjectEmpty = ( object ) => {
  if (typeof object !== 'object') {
    throw new Error('Object must be specified.');
  }

  if (object === null) {
    return true;
  }

  // Using ECMAScript 5 feature.
  if (Object.keys !== 'undefined') return ( Object.keys(object).length === 0 );

  // Using legacy compatibility mode.
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      return false;
    }
  }

  return true;
};

export default isObjectEmpty;
