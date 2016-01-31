import redis from 'redis';
import Promise from 'bluebird';
import config from '../../config';
// Promisify redis with bluebird
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const redisHost = REDIS_HOST;
const redisPort = REDIS_PORT;
const dbNumber = REDIS_DBNUMBER;
const redisPassword = config.redis.PASSWORD;

const client = redis.createClient(redisPort, redisHost, { auth_pass: redisPassword });
client.select(dbNumber);

const keyRoom = 'chatRooms';
const keyUser = 'users';

const chat = {
  /*
   * Create rooms
   * - Name description
   * - chat channel
   * - options
   */
  createRoom: ( request, callback ) => {
    const room = {
      id: null,
      name: request.payload.roomName || null,
      description: null,
      owner: request.payload.userId || null, // user id
      createdOn: null,
      location: request.payload.location || 'null',
      options: null
    };
    if ( room.name === null ||
         room.owner === null ||
         room.location === null
       ) {
      return callback(null);
    }
    const multi = client.multi();
    return client
    .incrAsync(keyRoom + ':seq')
    .then( id => {
      room.id = id;
      return multi
      // insert room data into redis
      .hmset(keyRoom + ':data:' + room.id, room)
      .sadd(keyRoom + ':unique:ids', room.id)
      .sadd(keyRoom + ':unique:location', room.location)
      .zadd(keyRoom + ':list:ids', 0, room.id)
      .zadd(keyRoom + ':list:location', 0, room.location)
      .hset(keyRoom + ':location', room.location, room.id)
      // insert user data into redis
      .zadd(keyUser + ':data:' + room.owner + ':' + keyRoom + ':list:ids', 0, room.id)
      .execAsync()
      .then( res => {
        return callback({
          id: room.id,
          name: room.name
        });
      }).catch( e => {
        console.error('Error creating a room: ', e.stack);
      });
    }).catch( e => {
      console.error('Error creating a room: ', e.stack);
    });
  },
  /*
   * List rooms
   */
  list: ( request, callback ) => {
    const idsArray = request.query.ids || null;
    const offset = request.query.offset || 0;
    const owner = request.query.owner || null;
    let limit = request.query.limit === 1 ? 0 : request.query.limit || 9999;
    limit = limit + offset;
   // if ( idsArray === null ) {
    let lookup = null;
    if ( owner !== null ) {
      lookup = keyUser + ':data:' + owner + ':' + keyRoom + ':list:ids';
    } else {
      lookup = keyRoom + ':list:ids';
    }
    return client.zrangeAsync(lookup, offset, limit)
    .then( ids => {
      if ( ids.length <= 0) {
        return callback(null);
      }
      if ( idsArray !== null ) {
        ids = idsArray;
      }
      return Promise.map( ids, id => {
        return client.hgetallAsync(keyRoom + ':data:' + id)
        .then( room => {
          return {
            id: id,
            name: room.name
          };
        }).catch( e => {
          console.error('error: ', e.stack);
        });
      })
      .then( ( rooms ) => {
        if (rooms.length < 1) {
          return callback(null);
        }

        return callback(rooms);
      });
    }).catch( e => {
      console.error('error: ', e.stack);
      return callback(null);
    });
  },
  /*
   * Read messages
   */
  readMessages: ( request, callback ) => {
    const room = {
      id: request.params.id || 0
    };

    if ( room.id === null || room.id <= 0 ) {
      return callback(null);
    }
    return client.lrangeAsync(keyRoom + ':data:' + room.id + ':messages', 0, -1)
    .then( messages => {
      const messagesArray = [];
      const userIds = [];
      let message = null;
      messages.map( messageString => {
        message = JSON.parse(messageString);
        userIds.push(message.userId);
        messagesArray.push(message);
      });
      const uniqueIds = [ ...new Set(userIds) ];
      const mapUserNames = new Map();

      return Promise.each( uniqueIds, userId => {
        return client.hgetAsync('users:data:' + userId, 'username')
        .then( userName => {
          return mapUserNames.set(userId, userName);
        }).catch( e => {
          console.error('error: ', e);
        });
      })
      .then(() => {
        const _messagesArray = [];
        messagesArray.map( message => {
          const time = message.time || 0;
          const messageObject = {
            username: mapUserNames.get(message.userId),
            text: message.text,
            time: time
          };
          _messagesArray.push(messageObject);
        });
        callback({
          id: room.id,
          messages: _messagesArray
        });
      }).catch( e => {
        console.error('error: ', e);
      });
    }).catch( e => {
      console.log('error: ', e);
    });
  }
};

export { chat as default };
