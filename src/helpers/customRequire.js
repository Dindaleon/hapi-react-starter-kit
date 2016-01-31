// Dependant on __SERVER__ variable

const customRequire = path => {
  let req = null;
  if (__SERVER__) {
    req = require('../extensions' + path);
  } else {
    const r = require.context('../extensions', true);
    req = r('.' + path);
  }
  return req;
};

export default customRequire;
