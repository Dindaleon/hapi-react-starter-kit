// import validateUser from './helpers/validateUser';
import { validateUser } from './controllers/functions/users';
import routes from './controllers';
import config from './config';
import { getActiveExtensionsSync } from './helpers/getActiveReducers';

let extendedApiRoutes = {};
const activeExtensions = getActiveExtensionsSync();
for ( const extensionFolderName of activeExtensions) {
  let extensionController = null;
  try {
    extensionController = require('./extensions/' + extensionFolderName + '/controllers/index').default;
    extendedApiRoutes[extensionFolderName] = extensionController;
  } catch (e) {
    // console.log('This extension (' + extensionFolderName + ') does not have controllers.');
  }
}
extendedApiRoutes = Object.assign({}, routes, extendedApiRoutes);

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

  for (const key in extendedApiRoutes) {
    if (extendedApiRoutes.hasOwnProperty( key )) {
      server.select('api').route(extendedApiRoutes[key]);
    }
  }
  next();
};

register.attributes = {
  name: config.api.name,
  version: config.api.version
};

export default register;
