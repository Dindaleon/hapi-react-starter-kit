import Promise from 'bluebird';
import fetch from 'isomorphic-fetch';
import { parseJSON } from './fetchTools';
import config from '../config';

const methods = [ 'get', 'post', 'put', 'patch', 'del' ];

const formatUrl = path => {
  const adjustedPath = path[0] !== '/' ? '/' + path : path;

  if (__SERVER__) {
    // Prepend host and port of the API server to the path.
    return PROTOCOL +
           SERVER_HOST +
           ':' +
           SERVER_PORT +
           config.api.routes.path +
           adjustedPath;
  }
  // Prepend `/api` to relative URL, to proxy to API server.
  return config.api.routes.path + adjustedPath;
};

const attachQuery = ( url, query ) => {
  let urlResult = url;
  let concatParams = null;
  let count = 0;
  let and = '';

  if ( typeof query !== 'undefined' ) {
    urlResult = url + '?';

    for (const param in query) {
      and = count > 0 ? '&' : '';
      if ( query.hasOwnProperty( param ) ) {
        concatParams = and + param + '=' + query[param];
      }
      count++;
    }
    urlResult = urlResult + concatParams;
  }

  return urlResult;
};

class _ApiClient {
  constructor(req) {
    methods.forEach(( method ) =>
      this[method] = ( path, { headers, query, params, data } = {}) => new Promise(( resolve, reject ) => {
        let body = null;
        let content = '';

        if (__SERVER__ && req.headers.cookie) {
          headers.Cookie = req.headers.cookie;
        }

        if (!__SERVER__ && typeof query !== 'undefined') {
          path = attachQuery(path, query);
        }


        if (!__SERVER__ && typeof data !== 'undefined') {
          body = JSON.stringify(data);
        }

        if ( body !== null ) {
          content = {
            credentials: 'same-origin',
            method,
            headers,
            body
          };
        } else {
          content = {
            credentials: 'same-origin',
            method,
            headers
          };
        }

        fetch(formatUrl(path), content)
        .then(parseJSON)
        .then( response => {
          if ( !response.error ) {
            resolve(response);
          } else {
            reject( new Error(response.error) );
          }
        });
      })
    );
  }
}

const ApiClient = _ApiClient;

export default ApiClient;
