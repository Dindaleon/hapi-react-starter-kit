import redis from 'redis';
import Promise from 'bluebird';
import Iron from 'iron';
import config from './config';
import isObjectEmpty from './helpers/objectTools';
// Promisify redis with bluebird
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);
// Promisify Iron
Promise.promisifyAll(Iron);

// TODO: improve and clean
const register = ( server, options, next ) => {
  server.ext({
    type: 'onPostAuth',
    method: ( request, reply ) => {
      const isAuthenticated = request.auth.isAuthenticated;
      const expiredCredentials = request.auth.credentials ? request.auth.credentials : null;

      if (isObjectEmpty(request.state) || typeof request.state === 'undefined') {
        if (isAuthenticated && expiredCredentials === 'expired') {
          console.log('User\'s credentials are expired.');
          // Return if user's credentials have expired.
          return reply({
            'statusCode': 401,
            'error': 'Unauthorized',
            'message': 'Token expired',
            'attributes': {
              "'error'": 'Token expired'
            }
          }).code(401).header('Www-Authenticate', 'Token error="Token expired"');
        }

        return reply.continue();
      } else if (typeof request.state.USER_SESSION !== 'undefined') {
        if (isAuthenticated && expiredCredentials === 'expired') {
          console.log('User\'s credentials are expired.');
          // Return if user's credentials have expired.
          return reply({
            'statusCode': 401,
            'error': 'Unauthorized',
            'message': 'Token expired',
            'attributes': {
              "'error'": 'Token expired'
            }
          }).code(401).header('Www-Authenticate', 'Token error="Token expired"');
        }

        // Set state session from client cookie
        Iron.unsealAsync(request.state.USER_SESSION, config.iron.secret, Iron.defaults)
        .then( unsealed => {
          request.state.session = unsealed;

          return reply.continue();
        })
        .catch( e => {
          // Set request state session object to null when cookie/session
          // data is corrupted or unavailable
          console.error('error unsealing session data: ', e.stack);
          request.state.session = null;
          return reply.continue();
        });
      } else {
        return reply.continue();
      }
      // Issue a new access token if the user is authenticated
      // and the current access token has expired
      // and the unique identifier is valid
    }
  });
  next();
};

register.attributes = {
  name: 'issueToken',
  version: '0.0.1'
};

export default register;
