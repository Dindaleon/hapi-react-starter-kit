const config = {
  app: {
    title: 'Hapi React SK',
    description: 'A hapi React Starter kit with react-router, redux, react-transform.',
    head: {
      titleTemplate: 'Hapi React SK: %s',
      meta: [
        { name: 'description', content: 'A hapi React Starter kit with react-router, redux, react-transform.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { charset: 'utf-8' },
        { property: 'og:site_name', content: 'Hapi React Starter Kit' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:title', content: 'Hapi React Starter Kit' },
        { property: 'og:description', content: 'A hapi React Starter kit with react-router, redux, react-transform.' },
        { property: 'og:card', content: 'summary' },
        { property: 'og:site', content: '@Dindaleon' },
        { property: 'og:creator', content: '@Dindaleon' },
        { property: 'og:title', content: 'Hapi React Starter Kit' },
        // { property: 'og:image', content: '' },
        // { property: 'og:image:width', content: '200' },
        // { property: 'og:image:height', content: '200' }
      ],
      link: [
        { rel: 'shortcut icon', href: '/favicon.ico' }
      ]
    },
    theme: {
      name: 'default'
    }
  },
  server: {
    auth: {
      scheme: 'jwt',
      strategy: 'jwt_token',
      // Never Share your secret key
      // Generate your own key at: https://www.grc.com/passwords.htm
      secret: '24CC51A1D75D4736AEB38782617DEDC02E7A79ECD6FA9D49545386B138AC6658',
      // Pick a strong algorithm
      algorithms: 'HS256'
    },
    // Change these to fit your needs.
    protocol: 'http://',
    developmentUrl: 'http://localhost:3000',
    productionUrl: 'http://localhost:8080',
    // productionUrl: 'http://hapi-reactstarterkit.rhcloud.com',
    // Websockets server
    ws: {
      // replace with your production host
      host: 'http://hapi-reactstarterkit.rhcloud.com',
      port: 8000
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
    // Generate your own key at: https://www.grc.com/passwords.htm
    secret: '24CC51A1D75D4736AEB38782617DEDC02E7A79ECD6FA9D49545386B138AC6658'
  }
};

export default config;
