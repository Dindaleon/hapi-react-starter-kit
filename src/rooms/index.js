import socketIO from 'socket.io';
import redis from 'redis';
import JWT from 'jsonwebtoken';
import Promise from 'bluebird';
import config from '../config';
const keyRoom = config.redis.key.rooms;

const redisHost = REDIS_HOST;
const redisPort = REDIS_PORT;
const dbNumber = REDIS_DBNUMBER;
const redisPassword = config.redis.PASSWORD;

const client = redis.createClient(redisPort, redisHost, { auth_pass: redisPassword });
const pub = redis.createClient(redisPort, redisHost, { auth_pass: redisPassword });
const sub = redis.createClient(redisPort, redisHost, { auth_pass: redisPassword });
client.select(dbNumber);
pub.select(dbNumber);
sub.select(dbNumber);
sub.subscribe(keyRoom);

// Promisify redis with bluebird
Promise.promisifyAll(redis.RedisClient.prototype);
// Promisify JWT
Promise.promisifyAll(JWT);

const register = (server, options, next) => {
  const io = socketIO(options.server.listener);
  io.on('connection', socket => {
    console.log('user connnected');

    socket.on('typing', (data) => {
      io.emit('typing', {
        'username': data.username
      });
    });

    socket.on('msg', (data) => {
      if ( typeof data.accessToken === 'undefined' ) return false;
      JWT.verifyAsync(data.accessToken, config.server.auth.secret)
      .then( decoded => {
        // Retrieve user's id and username from redis
        const str = JSON.stringify({
          'userId': decoded.id,
          'text': data.text,
          'time': data.time
        });
        pub.rpush(keyRoom + ':data:' + data.roomId + ':messages', str);
        pub.publish(keyRoom, str);
        io.emit('msg', {
          'username': data.username,
          'text': data.text,
          'time': data.time
        });
      }).catch( e => {
        console.error('Error Verifying accessToken ', e);
      });
    });

    sub.on('message', (channel, message) => {
      socket.emit(channel, message);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  next();
};

register.attributes = {
  name: 'hapi-rooms',
  version: '0.0.1'
};

export default register;
