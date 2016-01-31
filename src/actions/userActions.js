export const LOAD = 'LOAD';
export const LOAD_SUCCESS = 'LOAD_SUCCESS';
export const LOAD_FAILURE = 'LOAD_FAILURE';
export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';
export const UPDATE = 'UPDATE';
export const UPDATE_SUCCESS = 'UPDATE_SUCCESS';
export const UPDATE_FAILURE = 'UPDATE_FAILURE';
export const REGISTER = 'REGISTER';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';
export const SET_COORDINATES = 'SET_COORDINATES';
export const SET_LOCALE = 'SET_LOCALE';
export const SET_USER_AGENT = 'SET_USER_AGENT';
export const SWITCH_LOCALE = 'SWITCH_LOCALE';
export const SWITCH_LOCALE_SUCCESS = 'SWITCH_LOCALE_SUCCESS';
export const SWITCH_LOCALE_FAILURE = 'SWITCH_LOCALE_FAILURE';


export const load = ( accessToken ) => {
  return {
    type: [ LOAD ],
    promise: ( client ) => client.get('/oauth/token', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': accessToken
      },
      params: {
        authorization: true
      }
    })
  };
};

export const login = ( username, password ) => {
  return {
    type: [ LOGIN ],
    promise: ( client ) => client.post('/login', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        username,
        password
      }
    })
  };
};

export const logout = ( sessionId ) => {
  return {
    type: [ LOGOUT ],
    promise: ( client ) => client.post('/logout', {
      headers: {
        'sessionid': sessionId
      }
    })
  };
};

export const register = ( username, password, email ) => {
  return {
    type: [ REGISTER ],
    promise: ( client ) => client.post('users', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        username,
        password,
        email
      }
    })
  };
};

export const update = ( user ) => {
  return {
    type: [ UPDATE ],
    promise: ( client ) => client.put('/users/update', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': user.accessToken,
      },
      params: {
        authorization: true
      },
      data: {
        id: parseInt(user.id, 10),
        username: user.username,
        email: user.email
      }
    })
  };
};

export const setCoordinates = ( coordinates ) => {
  return {
    type: SET_COORDINATES,
    coordinates
  };
};

export const setLocale = ( locale ) => {
  return {
    type: SET_LOCALE,
    locale
  };
};

export const switchLocale = ( user, direct ) => {
  return {
    type: [ SWITCH_LOCALE ],
    promise: client => client.put('/users/update', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': user.accessToken,
      },
      params: {
        authorization: true
      },
      data: {
        id: parseInt(user.id, 10),
        locale: user.locale,
        switchLocale: direct
      }
    })
  };
};

export const setUserAgent = ( userAgent ) => {
  return {
    type: SET_USER_AGENT,
    userAgent
  };
};

export const isAuthLoaded = ( globalState ) => {
  return globalState.user && globalState.user.loaded;
};
