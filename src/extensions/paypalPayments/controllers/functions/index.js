import Promise from 'bluebird';
import fetch from 'isomorphic-fetch';
import config from '../../../../config';
import paymentsConfig from '../../';
let paymentsFunctions = {};
if (__SERVER__) {
  const redis = require('redis');

  // Promisify redis with bluebird
  Promise.promisifyAll(redis.RedisClient.prototype);
  Promise.promisifyAll(redis.Multi.prototype);
  Promise.promisifyAll(fetch);

  const redisHost = REDIS_HOST;
  const redisPort = REDIS_PORT;
  const dbNumber = REDIS_DBNUMBER;
  const redisPassword = config.redis.PASSWORD;

  const client = redis.createClient(redisPort, redisHost, { auth_pass: redisPassword });
  client.select(dbNumber);

  const keyPayment = 'payments';
  const keyPayouts = 'payouts';
  const keyUser = 'users';

  // TODO user model
  // TODO payment model

  const apiUrl = paymentsConfig.api.host;

  const requestPaypalToken = () => {
    return new Promise( ( resolve, reject ) => {
      let accessToken = null;
      const oauthRoute = paymentsConfig.api.routes.oauth;
     // First, request Access token from Paypal
      const authorizationBase64 = new Buffer(paymentsConfig.api.client_id + ':' + paymentsConfig.api.client_secret).toString('base64');
      const headersOauth = {
        'authorization': 'Basic ' + authorizationBase64,
        'cache-control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      const grantType = 'grant_type=client_credentials';
      const timeout = setTimeout(() => {
        reject( new Error('Error connecting to Paypal\'s servers') );
      }, 6500);
      fetch(apiUrl + oauthRoute, {
        method: 'POST',
        headers: headersOauth,
        body: grantType
      }).then( data => {
        // If we get a response from paypal
        // clear timeout
        clearTimeout(timeout);
        const jsonData = data.json();
        return jsonData;
      }).then( response => {
        accessToken = response.access_token;
        if ( accessToken === null ) {
          reject(null);
        }
        accessToken = response.access_token;
        resolve(accessToken);
      });
    });
  };

  paymentsFunctions = {
    create: ( request, callback ) => {
      const user = {
        id: request.payload.userId || null,
        email: null
      };
      if (!request.payload.amount) {
        return callback(null);
      }
      const payment = {
        id: 0,
        gateway: 'paypal', // for now, paypal only.
        method: 'paypal', // for now, paypal only.
        createdAt: 0,
        status: 'pending', // default status: pending
        amount: {
          total: request.payload.amount,
          currency: 'USD'
        }
      };
      const paymentRoute = paymentsConfig.api.routes.payment;

      if (user.id === null) {
        return callback(null);
      }
      // First, request paypal token
      requestPaypalToken().then( accessToken => {
        // Second, insert payment data into database
        // request user data from database
        return client.sismemberAsync(keyUser + ':unique:ids', user.id)
        .then( () => {
          return client.incrAsync(keyPayment + ':seq')
          .then( id => {
            payment.id = id;
            payment.createdAt = Date.now();
            const transactionsAmount = payment.amount;
            payment.amount = JSON.stringify(payment.amount);
            // insert payment into database
            const multi = client.multi();
            return multi
              .hmset(keyPayment + ':data:' + id, payment)
              .sadd(keyPayment + ':unique:ids', id)
              .zadd(keyPayment + ':list:ids', 0, id)
              .zadd(keyUser + ':data:' + user.id + ':' + keyPayment + ':list:ids', 0, id)
              .execAsync()
            .then( res => {
              if ( res[0] === 'OK' ) {
                // Third, request payment creation
                // If successful, return payment created data
                // If failed, return null.
                const headers = {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + accessToken
                };

                const data = {
                  'intent': 'sale',
                  'redirect_urls': {
                    'return_url': SERVER_URI + '/payments/approved/amount/' + transactionsAmount.total,
                    'cancel_url': SERVER_URI + '/payments/cancel'
                  },
                  'payer': {
                    'payment_method': payment.method
                  },
                  'transactions': [
                    {
                      'amount': transactionsAmount
                    }
                  ]
                };
                const body = JSON.stringify(data);
                return fetch(apiUrl + paymentRoute, {
                  method: 'POST',
                  headers,
                  body
                }).then( data => {
                  return data.json();
                }).then( response => {
                  // If response OK, return redirect_url
                  if ( response.state === 'created' ) {
                    // Update payment status to created.
                    // Update payment with paypalPayId
                    // Or any other gateway id
                    // and return response
                    const multi = client.multi();
                    return multi
                      .hset(keyPayment + ':data:' + id, 'status', 'created')
                      .hset(keyPayment + ':ids', response.id, id)
                      .execAsync()
                    .then( () => {
                      return callback({
                        paypalPayId: response.id,
                        approvalUrl: response.links[1].href
                      });
                    }).catch( e => {
                      console.error('Error: unable to update payment id ' + id + ' into database ' + e.stack);
                      return callback(null);
                    });
                  }
                  return callback(null);
                }).catch( e => {
                  console.error('Error: unable to fetch server gateway data ' + e.stack);
                  return callback(null);
                });
              }
              return callback(null);
            }).catch( e => {
              console.error('Error: unable to insert payment id ' + id + ' into database ' + e.stack);
            });
          }).catch( e => {
            console.error('Error: unable to create new payment id ' + e.stack);
          });
        }).catch( e => {
          console.error('Error: unable to find user with id ' + user.id + ', ' + e.stack);
        });
      }).catch( e => {
        if ( e !== null ) {
          console.error('ERROR: an error was encountered while requesting a paypal token.', e.stack);
        }
        return callback(null);
      });
    },
    /**
     * Execute payment
     */
    execute: ( request, callback ) => {
      const user = {
        id: request.payload.userId || null,
        funds: 0
      };
      let payment = {
        id: null // from database
      };
      const gateway = {
        paymentId: request.payload.paymentId || null, // from paypal
        payerID: request.payload.payerID || null // from paypal
      };
      const paymentRoute = paymentsConfig.api.routes.payment;
      if ( user.id === null ||
           gateway.paymentId === null ||
           gateway.payerID === null ) {
        return callback(null);
      }
      requestPaypalToken().then( accessToken => {
        const executeRoute = paymentsConfig.api.routes.execute;
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        };
        const data = {
          'payer_id': gateway.payerID
        };
        const body = JSON.stringify(data);
        fetch(apiUrl + paymentRoute + '/' + gateway.paymentId + executeRoute, {
          method: 'POST',
          headers,
          body
        })
        .then( data => {
          let json = null;
          if (data.status === 200 ) {
            json = data.json();
          } else if ( data.status === 400 ) {
            json = {
              status: 400,
              statusText: 'Bad Request'
            };
          } else {
            json = {
              status: 404,
              statusText: 'Not Found'
            };
          }
          return json;
        })
        .then( response => {
          if ( response.status >= 300 ) {
            return callback({ statusCode: response.status });
          }
          if ( response.state === 'approved' ) {
            // Update user payment to approved status
            return client.hgetAsync(keyPayment + ':ids', gateway.paymentId)
            .then( id => {
              return client.hgetallAsync(keyPayment + ':data:' + id)
              .then( _payment => {
                payment = _payment;
                payment.updatedAt = Date.now();
                payment.status = response.state;
                return client.hmsetAsync(keyPayment + ':data:' + id, payment)
                .then( () => {
                  // Proceed to accredit user account
                  return client.hgetAsync(keyUser + ':data:' + user.id, 'funds')
                  .then( userFunds => {
                    const transactedTotalAmount = response.transactions[0].amount.total;
                    if ( userFunds === null ) {
                      user.funds = Number(transactedTotalAmount);
                    } else {
                      user.funds = Number(userFunds) + Number(transactedTotalAmount);
                    }
                    return client.hsetAsync(keyUser + ':data:' + user.id, 'funds', user.funds)
                    .then( () => {
                      return callback({
                        id: payment.id,
                        status: payment.status,
                        funds: user.funds
                      });
                    }).catch( e => {
                      console.error('ERROR: user ' + user.id + ' could not be accredited. ', e.stack);
                      return callback(null);
                    });
                  }).catch( e => {
                    console.error('ERROR: user ' + user.id + ' funds could not be retrieved. ', e.stack);
                    return callback(null);
                  });
                }).catch( e => {
                  console.error('ERROR: payment id ' + payment.id + ' could not be updated. ', e.stack);
                  return callback(null);
                });
              }).catch( e => {
                console.error('ERROR: payment id ' + id + ' could not be retrieved from database. ', e.stack);
              });
            }).catch( e => {
              console.error('ERROR: payment id could not be retrieved. ', e.stack);
              return callback(null);
            });
          }
          return callback(null);
        }).catch( e => {
          console.error('ERROR: an error was encountered while executing payment. ', e.stack);
        });
      }).catch( e => {
        console.error('ERROR: an error was encountered while requesting a paypal token.', e.stack);
        return callback(null);
      });
    },
    /**
     * Get User Payment Data
     */
    getUserPaymentData: ( request, callback ) => {
      const user = {
        id: request.params.id || null,
        funds: 0
      };
      if ( user.id === null ) {
        return callback(null);
      }
      return client.sismemberAsync(keyUser + ':unique:ids', user.id)
      .then( () => {
        return client.hgetAsync(keyUser + ':data:' + user.id, 'funds')
        .then( _funds => {
          if ( _funds === null ) {
            user.funds = 0;
          } else {
            user.funds = _funds;
          }
          return callback({
            user
          });
        }).catch( e => {
          console.error('ERROR: user id ' + user.id + ' funds could not be retrieved. ', e.stack);
          return callback(null);
        });
      }).catch( e => {
        console.error('ERROR: user with id ' + user.id + ' could not be retrieved. ', e.stack);
        return callback(null);
      });
    },
    /**
     * Create payment payouts
     */
    createPayouts: ( request, callback ) => {
      const user = {
        id: request.payload.userId || null,
        email: null,
        funds: 0
      };
      if (!request.payload.amount ||
          typeof request.payload.amount !== 'number' ||
          request.payload.amount < 0) {
        return callback(null);
      }
      // TODO Batch Payouts
      // Single Payout
      const payout = {
        id: 0,
        createdAt: 0,
        status: 'pending', // default status: pending, then: completed
        amount: {
          value: request.payload.amount,
          currency: 'USD'
        }
      };
      const payoutsRoute = paymentsConfig.api.routes.payouts;

      if (user.id === null) {
        return callback(null);
      }
      // First, request paypal token
      requestPaypalToken().then( accessToken => {
        // Second, insert payment data into database
        // request user data from database
        return client.sismemberAsync(keyUser + ':unique:ids', user.id)
        .then( () => {
          return client.hgetallAsync(keyUser + ':data:' + user.id)
          .then( _user => {
            user.email = _user.email;
            user.funds = Number(_user.funds);
            const payoutAmountValue = Number(payout.amount.value);
            if (payout.amount.value > user.funds) {
              // Add error indicating that user has not enough funds
              // for completing the payout.
              return callback({
                status: 'insufficient funds'
              });
            }
            return client.incrAsync(keyPayouts + ':seq')
            .then( id => {
              payout.id = id;
              payout.createdAt = Date.now();
              const itemsAmount = payout.amount;
              payout.amount = JSON.stringify(payout.amount);
              // insert payment into database
              const multi = client.multi();
              return multi
                .hmset(keyPayouts + ':data:' + id, payout)
                .sadd(keyPayouts + ':unique:ids', id)
                .zadd(keyPayouts + ':list:ids', 0, id)
                .zadd(keyUser + ':data:' + user.id + ':' + keyPayouts + ':list:ids', 0, id)
                .execAsync()
              .then( res => {
                if ( res[0] === 'OK' ) {
                  // Third, request payment creation
                  // If successful, return payment created data
                  // If failed, return null.
                  const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                  };

                  const data = {
                    'sender_batch_header': {
                      'email_subject': paymentsConfig.payouts.emailSubject
                    },
                    'items': [
                      {
                        'recipient_type': 'EMAIL',
                        'amount': itemsAmount,
                        'receiver': user.email,
                        // 'note': 'Payment for recent T-Shirt delivery',
                        'sender_item_id': user.id
                      }
                    ]
                  };
                  const body = JSON.stringify(data);
                  // ?sync_mode=true is used for single payouts
                  return fetch(apiUrl + payoutsRoute + '?sync_mode=true', {
                    method: 'POST',
                    headers,
                    body
                  }).then( data => {
                    return data.json();
                  }).then( response => {
                    // If response OK, return redirect_url
                    if ( response.batch_header.batch_status === 'SUCCESS' &&
                         response.items[0].transaction_status === 'SUCCESS' ) {
                      // Update user funds
                      // Update payment status to created.
                      // Update payment with paypalPayId
                      // Or any other gateway id
                      // and return response
                      user.funds = user.funds - payoutAmountValue;
                      payout.status = 'completed';
                    } else if ( response.items[0].transaction_status === 'UNCLAIMED') {
                      payout.status = 'unclaimed';
                    }
                    payout.bactchId = response.batch_header.payout_batch_id;
                    payout.completedAt = Date.now();
                    const multi = client.multi();
                    return multi
                      .hmset(keyPayouts + ':data:' + id, payout)
                      .hset(keyPayouts + ':ids', response.batch_header.payout_batch_id, id)
                      .hset(keyUser + ':data:' + user.id, 'funds', user.funds)
                      .execAsync()
                    .then( () => {
                      return callback({
                        id: payout.id,
                        funds: user.funds,
                        status: payout.status,
                        bactchId: payout.bactchId,
                        payoutUrl: response.links[0].href
                      });
                    }).catch( e => {
                      console.error('Error: unable to update payout id ' + id + ' into database ' + e.stack);
                      return callback(null);
                    });
                  }).catch( e => {
                    console.error('Error: unable to fetch server gateway data ' + e.stack);
                    return callback(null);
                  });
                }
                return callback(null);
              }).catch( e => {
                console.error('Error: unable to insert payout id ' + id + ' into database ' + e.stack);
              });
            }).catch( e => {
              console.error('Error: unable to create new payout id ' + e.stack);
            });
          });
        }).catch( e => {
          console.error('Error: unable to find user with id ' + user.id + ', ' + e.stack);
        });
      }).catch( e => {
        if ( e !== null ) {
          console.error('ERROR: an error was encountered while requesting a paypal token.', e.stack);
        }
        return callback(null);
      });
    },
  };
}
export { paymentsFunctions as default };
