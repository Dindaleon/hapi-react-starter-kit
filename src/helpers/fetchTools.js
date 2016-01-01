const checkStatus = response => {
  // console.log('----- CHECK STATUS: ', response)
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  return null;
};

const parseJSON = response => {
  // console.log('----- PARSE JSON: ', response)
  if ( response !== null) {
    return response.json();
  }

  return null;
};

export { checkStatus, parseJSON };
