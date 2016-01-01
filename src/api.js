// import validateUser from './helpers/validateUser';
import { validateUser } from './controllers/functions/users';
import routes from './controllers';
import config from './config';

const register = ( server, options, next ) => {
  // Set Auth Strategy
  server.auth.strategy(
    config.server.auth.strategy,
    config.server.auth.scheme,
    {
      key: config.server.auth.secret,
      validateFunc: validateUser, // validate function defined above (imported)
      verifyOptions: {
        ignoreExpiration: true,
        algorithms: [ config.server.auth.algorithms ] }
    }
  );
  // server.auth.default(config.server.auth.strategy);

  for (const key in routes) {
    if (routes.hasOwnProperty( key )) {
      server.select('api').route(routes[key]);
    }
  }
  next();
};

register.attributes = {
  name: config.api.name,
  version: config.api.version
};

export default register;
