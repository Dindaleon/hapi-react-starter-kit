import redis from 'redis';
import Promise from 'bluebird';
import Iron from 'iron';
import JWT from 'jsonwebtoken';
import aguid from 'aguid';
import { encrypt, decrypt } from '../../helpers/forgeTools';
import isObjectEmpty from '../../helpers/objectTools';

import config from '../../config';

// Promisify redis with bluebird
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);
// Promisify JWT
Promise.promisifyAll(JWT);
// Promisify Iron
Promise.promisifyAll(Iron);

const redisHost = REDIS_HOST;
const redisPort = REDIS_PORT;
const dbNumber = REDIS_DBNUMBER;
const redisPassword = config.redis.PASSWORD;

const client = redis.createClient(redisPort, redisHost, { auth_pass: redisPassword });
client.select(dbNumber);

const key = 'users';
const users = {
  /**
   *  Create a new user.
   */
  create: ( request, callback ) => {
    const user = {
      id: 0,
      username: request.payload.username,
      email: request.payload.email,
      password: request.payload.password,
      scope: 'user'
    };
    const multi = client.multi();
    return multi
      .sismember(key + ':unique:usernames', user.username)
      .sismember(key + ':unique:emails', user.email)
      .execAsync()
      .then( res => {
        if ( res[0] === 1 ) { // if username exists, return username
          return callback(user.username);
        } else if ( res[1] === 1 ) { // if email exists. return email
          return callback(user.email);
        }
        return client
        .incrAsync(key + ':seq')
        .then( id => {
          // Add id tu user object
          user.id = id;
          // Hash user password
          return Iron.sealAsync(
            user.password,
            config.iron.secret,
            Iron.defaults
          )
          .then( sealed => {
            // Save unsealed password to return it
            // and proceed to login user if
            // registration was successful
            const unsealedPass = user.password;
            user.password = sealed;
            return multi
            .hmset(key + ':data:' + id, user)
            .sadd(key + ':unique:ids', id)
            .sadd(key + ':unique:usernames', user.username)
            .sadd(key + ':unique:emails', user.email)
            .zadd(key + ':list:ids', 0, id)
            .zadd(key + ':list:usernames', 0, user.username)
            .zadd(key + ':list:emails', 0, user.email)
            .hset(key + ':usernames', user.username, id)
            .hset(key + ':emails', user.email, id)
            .execAsync()
            .then( res => {
              if ( res[0] === 'OK' ) {
                user.password = unsealedPass;
                // return user data for further action
                // eg. logging in the user
                return callback(user);
              }
              return callback(null);
            });
          }).catch( e => {
            console.error('error sealing password: ', e.stack);
          });
        }).catch( e => {
          console.error('error: ', e.stack);
        });
      });
  },
  /**
   *  Get user by id.
   */
  read: ( request, callback ) => {
    const id = request.params.id;
    client.sismemberAsync(key + ':unique:ids', id)
    .then( exists => {
      if ( exists ) {
        client
        .hgetallAsync(key + ':data:' + id)
        .then( user => {
          return callback({
            username: user.username,
            email: user.email
          });
        }).catch( e => {
          console.error('error: ', e.stack);
        });
      } else {
        return callback(null);
      }
    }).catch( e => {
      console.error('error: ', e.stack);
    });
  },
  /**
   *  Update existing user
   */
   // TODO: Improve code
  update: ( request, callback ) => {
    const user = {
      id: request.params.id || request.payload.id || null,
      username: request.payload.username || null,
      email: request.payload.email || null,
      password: request.payload.password || null,
      locale: request.payload.locale || null
    };
    const switchLocale = request.payload.switchLocale || false; // Boolean
    if ( user.id === null ) {
      return callback(null);
    }
    // if locale is changed
    // TODO: improve user swtich locale
    // perhaps implement a dedicated function
    if ( switchLocale ) {
      return client.sismemberAsync(key + ':unique:ids', user.id)
      .then( () => {
        return client.hsetAsync(key + ':data:' + user.id, 'locale', request.payload.locale)
        .then( () => {
          return callback({ ok: 'OK', locale: request.payload.locale });
        })
        .catch( e => {
          console.error('Error setting user locale: ', e.stack);
          return callback(null);
        });
      })
      .catch( e => {
        console.error('Error finding user: ', e.stack);
        return callback(null);
      });
    }
    // Return if locale has been updated.
    return client.sismemberAsync(key + ':unique:ids', user.id)
    .then( exists => {
      if (exists) {
        return client.hgetallAsync(key + ':data:' + user.id)
        .then( _user => {
          const multi = client.multi();
          return multi
            .sismember(key + ':unique:usernames', user.username)
            .sismember(key + ':unique:emails', user.email)
            .execAsync()
            .then( res => {
              if ( res[0] === 1 && _user.username !== user.username ) {
                return callback({
                  error: 'username',
                  username: user.username
                });
              } else if ( res[1] === 1 && _user.email !== user.email ) {
                return callback({
                  error: 'email',
                  email: user.email
                });
              }
              if (user.username !== null) {
                multi
                  .srem(key + ':unique:usernames', _user.username)
                  .sadd(key + ':unique:usernames', user.username)
                  .zrem(key + ':list:usernames', _user.username)
                  .zadd(key + ':list:usernames', user.id, user.username)
                  .hdel(key + ':usernames', _user.username)
                  .hset(key + ':usernames', user.username, user.id)
                  .execAsync();
              } else {
                user.username = _user.username;
                // delete user.username;
              }

              if (user.email !== null) {
                multi
                  .srem(key + ':unique:emails', _user.email)
                  .sadd(key + ':unique:emails', user.email)
                  .zrem(key + ':list:emails', _user.email)
                  .zadd(key + ':list:emails', user.id, user.email)
                  .hdel(key + ':emails', _user.email)
                  .hset(key + ':emails', user.email, user.id)
                  .execAsync();
              } else {
                user.email = _user.email;
                // delete user.email;
              }
              // Hash user password
              if (user.password !== null) {
                return Iron.sealAsync(
                  user.password,
                  config.iron.secret,
                  Iron.defaults
                )
                .then( sealed => {
                  user.password = sealed;
                  return client.hmsetAsync(key + ':data:' + user.id, user)
                  .then( updated => {
                    return callback({
                      ok: updated,
                      username: user.username,
                      email: user.email
                    });
                  });
                }).catch( e => {
                  console.error('error sealing password: ', e.stack);
                });
              }
              delete user.password;
              return client.hmsetAsync(key + ':data:' + user.id, user)
              .then( updated => {
                return callback({
                  ok: updated,
                  username: user.username,
                  email: user.email
                });
              });
            });
        }).catch( e => {
          console.error('error: ', e.stack);
        });
      }
      return callback(null);
    });
  },
  /**
   *  Delete a user
   */
  delete: ( request, callback ) => {
    const id = request.params.id;
    client.sismemberAsync(key + ':unique:ids', id)
    .then( exists => {
      if (exists) {
        client.hgetallAsync(key + ':data:' + id)
        .then( _user => {
          const multi = client.multi();
          multi
            .zrem(key + ':list:ids', id)
            .zrem(key + ':list:usernames', id)
            .zrem(key + ':list:emails', id)
            .srem(key + ':unique:ids', id)
            .srem(key + ':unique:usernames', _user.username)
            .srem(key + ':unique:emails', _user.email)
            .del(key + ':data:' + id)
            .execAsync()
            .then( () => {
              return callback(true);
            });
        });
      } else {
        return callback(null);
      }
    });
  },
  /**
   *  Get users list
   *  Default: 10 users.
   */
  list: ( request, callback ) => {
    const idsArray = request.query.ids || null;
    const offset = request.query.offset || 0;
    let limit = request.query.limit === 1 ? 0 : request.query.limit || 9;
    limit = limit + offset;
   // if ( idsArray === null ) {
    client.zrangeAsync(key + ':list:ids', offset, limit)
    .then( _ids => {
      const ids = idsArray !== null ? idsArray : _ids;
      Promise.map( ids, id => {
        return client.hgetallAsync(key + ':data:' + id)
        .then( user => {
          return {
            username: user.username,
            email: user.email
          };
        }).catch( e => {
          console.error('error: ', e.stack);
        });
      })
      .then( ( users ) => {
        if (users.length < 1) {
          return callback(null);
        }

        return callback(users);
      });
    }).catch( e => {
      console.error('error: ', e.stack);
    });
  },
  /**
   *  Very user's credentials when logging in
   */
  login: ( request, callback ) => {
    const time = Date.now();
    const user = {
      username: request.payload.username || null,
      email: request.payload.email || null,
      password: request.payload.password,
      session: {
        id: null,
        userAgent: request.headers['user-agent'] || null,
        secret: null,
        iv: null,
        accessToken: null,
        refreshToken: null
      }
    };
    let guid = null;
    const login = user.username || user.email;
    let hash = null;
    const multi = client.multi();
    return multi
      .sismember(key + ':unique:usernames', user.username)
      .sismember(key + ':unique:emails', user.email)
      .execAsync()
      .then( res => {
        if ( res[0] === 1 ) {
          hash = 'usernames';
        } else if ( res[1] === 1 ) {
          hash = 'emails';
        } else {
          return callback(null); // this should never happen
        }
        return client.hgetAsync(key + ':' + hash, login)
        .then( id => {
          return client.hgetallAsync(key + ':data:' + id)
          .then( _user => {
            const sealed = _user.password;
            user.email = _user.email;
            return Iron.unsealAsync(
              sealed,
              config.iron.secret,
              Iron.defaults
            )
            .then( unsealed => {
              if ( unsealed === user.password ) {
                guid = aguid();
                // guid = aguid(id + user.email + time + guid);
                user.session.id = aguid(user.email + user.session.userAgent);
                user.session.accessToken = JWT.sign({
                  id: id,
                  username: user.username,
                  guid: guid
                },
                config.server.auth.secret, {
                  expiresIn: config.user.token.expiresIn
                });
                // Create a new Refresh Token
                user.session.refreshToken = {
                  id: id,
                  guid: guid,
                  revoked: false
                };
                // Generate a random SECRET KEY
                return encrypt(JSON.stringify(user.session.refreshToken), null, encrypted => {
                  user.session.refreshToken = JWT.sign(encrypted.data, config.server.auth.secret);
                  user.session.secret = encrypted.key;
                  user.session.iv = encrypted.iv;
                  user.session.guid = guid;
                  const multi = client.multi();
                  // Insert session in database
                  return multi
                  .hmset(key + ':data:' + id + ':sessions:' + user.session.id, user.session)
                  .zadd(key + ':data:' + id + ':sessions:ids', time, user.session.id)
                  .hset(key + ':sessions', user.session.id, id)
                  .execAsync()
                  .then( () => {
                    return Iron.sealAsync(
                      {
                        sessionId: user.session.id,
                        accessToken: user.session.accessToken,
                        refreshToken: user.session.refreshToken
                      },
                      config.iron.secret,
                      Iron.defaults
                    )
                    .then( ( sealed ) => {
                      return callback({
                        id: id,
                        username: user.username,
                        email: user.email,
                        locale: _user.locale,
                        encrypted: sealed,
                        sessionId: user.session.id,
                        accessToken: user.session.accessToken,
                        refreshToken: user.session.refreshToken,
                        scope: _user.scope
                      });
                    }).catch( e => {
                      console.error('error: ', e.stack);
                    });
                  }).catch( e => {
                    console.error('error: ', e.stack);
                  });
                });
              }
              console.error('error: login was unsuccessful.');
              return callback(null);
            }).catch( e => {
              console.error('error: ', e.stack);
            });
          }).catch( e => {
            console.error('error: ', e.stack);
          });
        }).catch( e => {
          console.error('error: ', e.stack);
        });
      });
  },
  /**
   *  Logs the user out of the system
   */
  logout: ( request, callback ) => {
    // Get current session id
    // remove session from the database
    const user = {
      id: null,
      session: {
        id: request.headers.sessionid ||
            request.state.session.sessionId ||
            null
      }
    };

    if (user.session.id === null) {
      return callback(null);
    }
    return client.hgetAsync(key + ':sessions', user.session.id)
    .then( userId => {
      user.id = userId;
      return client.sismemberAsync(key + ':unique:ids', user.id)
      .then( exists => {
        if ( exists ) {
          const multi = client.multi();
          return multi
            .del(key + ':data:' + user.id + ':sessions:' + user.session.id)
            .zrem(key + ':data:' + user.id + ':sessions:ids', user.session.id)
            .execAsync()
            .then( res => {
              return callback(res[0]);
            });
        }
        return callback(false);
      }).catch( e => {
        console.error('error: ', e.stack);
        return callback(false);
      });
    }).catch( e => {
      console.error('error: ', e.stack);
      return callback(false);
    });
  },
  /**
   * Validate user's secret key
   */
  validate: ( decoded, request, callback ) => {
    const time = Math.floor(Date.now() / 1000);
    // const iat = decoded.iat;
    const exp = decoded.exp;
    // const expiresIn = config.user.token.expiresIn;
    let isExpired = false;
    let isValid = false;
    isExpired = ( time >= exp ) ? true : isExpired;

    const user = {
      id: decoded.id || null
    };
    client.sismemberAsync(key + ':unique:ids', user.id)
    .then( exists => {
      if ( exists && !isExpired) {
        isValid = true;
      } else if ( exists && isExpired ) {
        isValid = true;
        isExpired = true;
        isExpired = 'expired';
      }

      return callback(null, isValid, isExpired);
    }).catch( e => {
      console.error('error: ', e.stack);
    });
  },
  /**
   *  Issue new access token
   */
  oauth: ( request, callback ) => {
    if ( typeof request.state.USER_SESSION === 'undefined' ) return callback(false);
    if ( isObjectEmpty(request.state) &&
         typeof request.headers.sessionId === 'undefined' &&
         typeof request.headers.refreshToken === 'undefined'
        ) {
      return callback(false);
    }

    let response = false;
    const user = {
      id: null,
      username: null,
      email: null,
      session: {
        id: request.headers.sessionid ||
            request.state.session.sessionId ||
            null,
        userAgent: request.headers['user-agent'] || null,
        secret: null,
        iv: null,
        accessToken: null,
        refreshToken: request.headers.refreshtoken ||
                      request.state.session.refreshToken ||
                      null,
        guid: null
      }
    };

    return client
    .hgetAsync(key + ':sessions', user.session.id)
    .then( userId => {
      user.id = userId;
      return client
      .hgetallAsync(key + ':data:' + user.id + ':sessions:' + user.session.id)
      .then( _session => {
        if ( _session !== null ) {
          // Checking session
          user.session.secret = _session.secret || null;
          user.session.iv = _session.iv || null;
          user.session.guid = _session.guid || null;
          user.session.revoked = _session.revoked || false;

          if (user.session.secret === null || user.session.iv === null) {
            return callback(false);
          }
          // Check refresh token
          return JWT.verifyAsync(user.session.refreshToken, config.server.auth.secret)
          .then( decoded => {
            const encryptedObject = {
              key: user.session.secret,
              iv: user.session.iv,
              data: decoded
            };
            return decrypt(encryptedObject, null, data => {
              try {
                JSON.parse(data);
              } catch (e) {
                console.error('ERROR parsing decrypted object: ', e);
                return callback(false);
              }
              const token = JSON.parse(data);
              const decryptedToken = {
                userId: token.id,
                guid: token.guid,
                revoked: token.revoked
              };
              // Check all data
              // If checks pass, issue new access token
              // get username from id
              return client.hgetallAsync(key + ':data:' + user.id)
              .then( _user => {
                if (
                  user.id.toString() === decryptedToken.userId.toString() &&
                  user.session.guid === decryptedToken.guid &&
                  user.session.revoked === decryptedToken.revoked
                ) {
                  const guid = aguid();
                  user.username = _user.username;
                  user.email = _user.email;
                  // console.log('ISSUING NEW A TOKEN')
                  // Issuing a new token
                  user.session.accessToken = JWT.sign({
                    id: user.id,
                    username: user.username,
                    guid: guid
                  },
                  config.server.auth.secret, {
                    expiresIn: config.user.token.expiresIn
                  });
                  // console.log('ALL CHECKS PASSED')
                  // All checks passed
                  // Save access token in case we want to
                  // show it to the user.
                  return client.hsetAsync(key + ':data:' + user.id + ':sessions:' + user.session.id,
                    'accessToken',
                    user.session.accessToken
                  )
                  .then( () => {
                    response = {
                      id: user.id,
                      username: user.username,
                      email: user.email,
                      locale: _user.locale,
                      sessionId: user.session.id,
                      accessToken: user.session.accessToken,
                      scope: _user.scope
                    };
                    return callback(response);
                  }).catch( e => {
                    console.error('error: ', e.stack);
                    return callback(false);
                  });
                }
                // console.log('ALL CHECKS FAILED')
                // All checks failed.
                return callback(false);
              }).catch( e => {
                console.error('error: ', e.stack);
              });
            });
          }).catch( e => {
            console.error('error: ', e.stack);
            // console.log('JWT Verification Failed.')
            // JWT Verification failed.
            return callback(false);
          });
        }
        return callback(false);
      }).catch( e => {
        console.error('error: ', e.stack);

        return callback(false);
      });
    });
  },
  /**
   *  Verifies user's access
   */
  verify: ( request, callback ) => {
    const isAuthenticated = request.auth.isAuthenticated;
    let result = {
      id: null,
      exp: null
    };

    if ( isAuthenticated === true ) {
      result = {
        id: request.auth.credentials.id,
        exp: request.auth.credentials.exp
      };
    }

    return callback(result);
  }
};

const validateUser = users.validate;
export { users as default, validateUser };
