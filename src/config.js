const config = {
  server: {
    auth: {
      scheme: 'jwt',
      strategy: 'jwt_token',
      // Never Share your secret key
      // Generate your own key at: https://www.grc.com/passwords.htm
      secret: '24CC51A1D75D4736AEB38782617DEDC02E7A79ECD6FA9D49545386B138AC6658',
      // Pick a strong algorithm
      algorithms: 'HS256'
    }
  },
  user: {
    token: {
      expiresIn: 4500 // seconds for expiring a user's session
    },
    session: {
      name: 'USER_SESSION',
      ttl: 24 * 60 * 60 * 1000 // one day
    },
    // Default locale for logged out user (Guest)
    locale: 'en',
    // Specify where to redirect the user after signin
    redirectOnLogin: 'home',
    // Specify where to redirect the user after signup
    redirectOnRegister: 'dashboard'
  },
  redis: {
    //HOST: REDIS_HOST || 'localhost',
    //PORT: REDIS_PORT || 6379,
    PASSWORD: 'ZTNiMGM0NDI5OGZjMWMxNDlhZmJmNGM4OTk2ZmI5',
    DBNUMBER: 1, // select redis database number. Default: 0
    key: {
      users: 'users',
      rooms: 'chatRooms'
    }
  },
  api: {
    name: 'api',
    routes: {
      path: '/api/v1'
    },
    version: '0.0.1',
    swagger: {
      documentationPath: '/api/v1/documentation',
      endpoint: '/api/v1/docs'
    }
  },
  iron: {
    secret: '24CC51A1D75D4736AEB38782617DEDC02E7A79ECD6FA9D49545386B138AC6658'
  }
};

export default config;
