import Joi from 'joi';
import rooms from './functions/rooms';

/*
 * Hapi Routes for controlling chats
 * - CRUD rooms
 * - Read/Write messages
 */
const chatRoomController = [
  /*
   * Create rooms
   */
  {
    method: 'POST',
    path: '/rooms',
    config: {
      tags: [ 'api', 'chat', 'rooms' ],
      description: 'Create a chat room',
      validate: {
        headers: Joi.object({
          authorization: Joi.string().required()
        }).unknown(),
        payload: {
          userId: Joi.number().integer().required(),
          roomName: Joi.string().min(4).max(24).required(),
          description: Joi.string()
        }
      },
      plugins: {
        'hapi-swagger': {
          responseMessages: [
            { 'code': 401, 'message': 'Unauthorized' },
            { 'code': 503, 'message': 'Service Unavailable' }
          ]
        }
      },
      auth: 'jwt_token'
    },
    handler: ( request, reply ) => {
      rooms.createRoom( request, result => {
        if ( result !== null ) {
          reply({
            statusCode: 200,
            message: 'Room Created Successfully.',
            data: result

          }).code(200);
        } else {
          reply({
            statusCode: 500,
            message: 'Something Bad Happened.',
            data: {
              result
            }
          }).code(500);
        }
      });
    }
  },
  /*
   * List rooms
   */
  {
    method: 'GET',
    path: '/rooms/list',
    config: {
      tags: [ 'api', 'room', 'list' ],
      description: 'Returns a list of rooms.',
      validate: {
        query: {
          offset: Joi
            .number()
            .integer()
            .description('Get rooms from offset.'),
          limit: Joi
            .number()
            .integer()
            .description('Limit number of rooms returned.'),
          ids: Joi
            .array()
            .unique()
            .description('List of rooms ids to retrieve.'),
          owner: Joi
            .number()
            .integer()
            .description('List rooms for owner id.')
        }
      },
      plugins: {
        'hapi-swagger': {
          responseMessages: [
            { 'code': 404, 'message': 'Rooms Not Found' },
            { 'code': 503, 'message': 'Service Unavailable' }
          ]
        }
      },
      handler: ( request, reply ) => {
        rooms.list( request, result => {
          if ( result !== null ) {
            reply({
              statusCode: 200,
              message: 'Rooms Found.',
              data: result
            }).code(200);
          } else if ( result === null ) {
            reply({
              statusCode: 404,
              message: 'Rooms Not Found.',
              error: '404 error'
            }).code(404);
          } else {
            reply({
              statusCode: 500,
              message: 'Something Bad Happened.',
              error: '500 error'
            }).code(500);
          }
        });
      }
    }
  },
  /*
   * Read messages from redis
   */
  {
    method: 'GET',
    path: '/rooms/{id}/messages',
    config: {
      tags: [ 'api', 'chat', 'messages' ],
      description: 'Retrieve messages',
      validate: {
        params: {
          id: Joi.number()
            .integer()
            .required()
            .description('Room\'s id')
        }
      },
    },
    handler: ( request, reply ) => {
      rooms.readMessages( request, result => {
        if ( result !== null ) {
          reply({
            statusCode: 200,
            message: 'Messages Retrieved Successfully',
            data: result
          }).code(200);
        } else {
          reply({
            statusCode: 500,
            message: 'Something Bad Happened.',
            error: 'err'
          }).code(500);
        }
      });
    }
  }
];

export { chatRoomController as default };
