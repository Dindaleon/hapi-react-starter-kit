import Joi from 'joi';
import users from './functions/users';
import config from '../config';

const userController = [
  /**
   *  Route for creating a user
   */
  {
    method: 'POST',
    path: '/users',
    config: {
      // Include this API in swagger documentation
      tags: [ 'api', 'users', 'post', 'create' ],
      description: 'Creates a new user',
      notes: 'Create a new user...',
      payload: {
        output: 'data',
        parse: true
      },
      validate: {
        payload: {
          username: Joi.string().alphanum().min(4).max(24).required(),
          email: Joi.string().email().required(),
          password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required()
        }
      },
      auth: false
    },
    handler: ( request, reply ) => {
      users.create( request, ( result ) => {
        if ( result !== null ) {
          reply({
            statusCode: 201,
            message: 'User Created Successfully.',
            data: result
          }).code(201);
        } else if ( result === request.payload.username ) {
          reply({
            statusCode: 409,
            message: 'Username Already Exists.'
          }).code(409);
        } else if ( result === request.payload.email ) {
          reply({
            statusCode: 409,
            message: 'Email Already Exists.'
          }).code(409);
        } else {
          reply({
            statusCode: 503,
            message: 'Error.'
          }).code(503);
        }
      });
    }
  },
  /**
   *  Route for retrieving a single user
   */
  {
    method: 'GET',
    path: '/users/{id}',
    config: {
      // Include this API in swagger documentation
      tags: [ 'api', 'users', 'read' ],
      description: 'Get user data',
      notes: 'Get user data...',
      validate: {
        params: {
          id: Joi.number()
            .integer()
            .required()
            .description('User\'s id')
        }
      },
      auth: false
    },
    handler: ( request, reply ) => {
      users.read( request, ( result ) => {
        if ( result !== null ) {
          reply({
            statusCode: 200,
            message: 'User Data Successfully Fetched.',
            user: result
          }).code(200);
        } else {
          reply({
            statusCode: 404,
            message: 'User Data Not Found.'
          }).code(404);
        }
      });
    }
  },
   /**
   *  Route for updating a user
   */
  {
    method: 'PUT',
    // path: '/users/{id}',
    path: '/users/update',
    config: {
      tags: [ 'api', 'users' ],
      description: 'Updates a user',
      notes: 'Update an existing user.',
      validate: {
        headers: Joi.object({
          authorization: Joi.string().required()
        }).unknown(),
        payload: {
          id: Joi.number().integer(),
          username: Joi.string().alphanum().min(4).max(24),
          email: Joi.string().email(),
          password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/),
          locale: Joi.string(),
          switchLocale: Joi.boolean()
        }
      },
      plugins: {
        'hapi-swagger': {
          responseMessages: [
            { 'code': 401, 'message': 'Unauthorized' },
            { 'code': 404, 'message': 'User Not Found' },
            { 'code': 409, 'message': 'Data Already in Use' },
            { 'code': 503, 'message': 'Service Unavailable' }
          ]
        }
      },
      auth: 'jwt_token'
    },
    handler: ( request, reply ) => {
      users.update( request, ( result ) => {
        if ( result !== null && result.ok === 'OK' ) {
          reply({
            statusCode: 200,
            message: 'User Updated Successfully.',
            data: {
              user: result
            }
          }).code(200)
          .header('Authorization', request.headers.authorization);
        } else if ( result === null ) {
          reply({
            statusCode: 404,
            message: 'User Not Found.'
          }).code(404);
        // } else if ( result === request.payload.username ) {
        } else if ( result.error === 'username' ) {
          reply({
            statusCode: 409,
            error: 'Username Already Exists.'
          }).code(409);
        } else if ( result.error === 'email' ) {
          reply({
            statusCode: 409,
            error: 'Email Already Exists.'
          }).code(409);
        } else {
          reply({
            statusCode: 503,
            message: 'Error.'
          }).code(503);
        }
      });
    }
  },
  /**
   *  Route for deleting a user
   * TODO: add scopes
   */
  {
    method: 'DELETE',
    path: '/users/{id}',
    config: {
      tags: [ 'api', 'users', 'delete', 'remove' ],
      description: 'Deletes a user',
      notes: 'Deletes a user from the database.',
      validate: {
        params: {
          id: Joi.number()
            .integer()
            .required()
            .description('User\'s id')
        }
      },
      plugins: {
        'hapi-swagger': {
          responseMessages: [
            { 'code': 404, 'message': 'User Not Found' },
            { 'code': 503, 'message': 'Service Unavailable' }
          ]
        }
      },
      auth: false
    },
    handler: ( request, reply ) => {
      users.delete( request, ( result ) => {
        if ( result === true ) {
          reply({
            statusCode: 200,
            message: 'User Deleted Successfully.'
          }).code(204);
        } else if ( result === null ) {
          reply({
            statusCode: 404,
            message: 'User Not Found.'
          }).code(404);
        } else {
          reply({
            statusCode: 503,
            message: 'Error.'
          }).code(503);
        }
      });
    }
  },
  /**
   *  Route for retrieving a list of users
   */
  {
    method: 'GET',
    path: '/users/list',
    config: {
      tags: [ 'api', 'users', 'query' ],
      description: 'Returns a list of users',
      notes: 'Returns a list of users. Queries: offset, limit.',
      validate: {
        headers: Joi.object({
          authorization: Joi.string().required()
        }).unknown(),
        query: {
          offset: Joi
            .number()
            .integer()
            .description('Get users from offset.'),
          limit: Joi
            .number()
            .integer()
            .description('Limit number of users returned.'),
          ids: Joi
            .array()
            .unique()
            .description('List of users ids to retrieve.')
        }
      },
      plugins: {
        'hapi-swagger': {
          responseMessages: [
            { 'code': 404, 'message': 'Users Not Found' },
            { 'code': 503, 'message': 'Service Unavailable' }
          ]
        }
      },
      auth: {
        strategy: 'jwt_token'
      }
    },
    handler: ( request, reply ) => {
      users.list( request, ( result ) => {
        if ( result !== null ) {
          reply({
            statusCode: 200,
            message: 'Users Found.',
            users: result
          })
          .code(200)
          .header('Authorization', request.headers.authorization);
        } else {
          reply({
            statusCode: 404,
            message: 'No Users Found.'
          }).code(404);
        }
      });
    }
  },
  /**
   *  Route for logging in a user
   */
  {
    method: 'POST',
    path: '/login',
    config: {
      tags: [ 'api', 'users' ],
      description: 'Logs the user into the system',
      notes: 'User can log in with username or email.',
      validate: {
        payload: Joi.object().keys({
          username: Joi.string().alphanum().min(4).max(24),
          email: Joi.string().email(),
          password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required()
        }).xor('username', 'email'),
        failAction: ( request, reply, source, error ) => {
          reply({
            statusCode: error.output.statusCode,
            message: 'Invalid input',
            error: error.output.payload.error
          }).code(error.output.statusCode);
        }
      },
      state: {
        parse: true, // parse and store in request.state
        failAction: 'log' // may also be 'ignore' or 'log'
      },
      auth: false
    },
    handler: ( request, reply ) => {
      users.login( request, ( result ) => {
        if ( result !== null ) {
          reply({
            statusCode: 200,
            message: 'User Successfully Logged In.',
            data: result
          })
          .state('USER_SESSION', result.encrypted,
            {
              ttl: config.user.session.ttl,
              path: '/'
            }
          )
          .code(200)
          .header('Cache-Control', 'no-store')
          .header('Pragma', 'no-cache');
        } else {
          reply({
            statusCode: 401,
            message: 'Wrong Credentials Entered.',
            error: 'wrongCredentials'
          });
        }
      });
    }
  },
  /**
   *  Route for logging out a user
   */
  {
    method: 'POST',
    path: '/logout',
    config: {
      tags: [ 'api', 'users' ],
      description: 'Logs the user out of the system',
      validate: {
        headers: Joi.object().keys({
          'sessionid': Joi
            .string()
            .required()
        }).unknown()
      },
      auth: false
    },
    handler: ( request, reply ) => {
      users.logout( request, ( result ) => {
        if ( result !== null ) {
          reply({
            statusCode: 200,
            message: 'User Successfully Logged Out.',
            data: {
              user: result
            }
          })
          .unstate('USER_SESSION')
          .code(200);
        } else {
          reply({
            statusCode: 401,
            message: 'User Session Could Not Be Closed.'
          });
        }
      });
    }
  },
  /**
   *  Grant new access token
   */
  {
    method: 'GET',
    path: '/oauth/token',
    config: {
      tags: [ 'api', 'oauth' ],
      description: 'Grants new access token',
      notes: 'Used for reissuing access tokens',
      validate: {
        headers: Joi.object().keys({
          'sessionid': Joi
            .string(),
          'refreshtoken': Joi
            .string()
        }).unknown()
      },
      auth: false
    },
    handler: ( request, reply ) => {
      users.oauth( request, ( result ) => {
        if ( result !== false ) {
          // on success, return access token
          reply({
            statusCode: 200,
            message: 'New Access Token Issued',
            data: result
          })
          .code(200)
          .header('Cache-Control', 'no-store')
          .header('Pragma', 'no-cache');
        } else if ( result === false ) {
          reply({
            statusCode: 404,
            message: 'Invalid Session.',
            data: {
              sessionId: 0
            }
          }).code(404);
        } else {
          reply({
            statusCode: 500,
            message: 'Something Bad Happened.'
          }).code(500);
        }
      });
    }
  },
  /**
   *  Verify user's access
   */
  {
    method: 'GET',
    path: '/oauth/verify',
    config: {
      tags: [ 'api', 'oauth', 'verify' ],
      description: 'Verifies user\'s access',
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
        }).unknown()
      },
      auth: {
        strategy: 'jwt_token',
        mode: 'try'
      }
    },
    handler: ( request, reply ) => {
      users.verify( request, ( result ) => {
        if ( result !== null ) {
          // on success, return access token
          reply({
            statusCode: 200,
            message: 'User Session Is Valid.',
            data: result
          })
          .code(200);
        } else if ( result === null ) {
          reply({
            statusCode: 404,
            message: 'Invalid Session.'
          }).code(404);
        } else {
          reply({
            statusCode: 500,
            message: 'Something Bad Happened.'
          }).code(500);
        }
      });
    }
  }
];

export { userController as default };
