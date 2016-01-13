import React, { Component, PropTypes } from 'react';
import { renderToString } from 'react-dom/server';
import serialize from 'serialize-javascript';

// Import assets
const scripts = [];
if (!__DEVELOPMENT__) {
  const webpackConfig = require('../../webpack/prod.config');
  const stats = require('../../static/assets/webpack.stats.json');
  const assets = stats.assetsByChunkName;
  for ( const key of Object.keys(assets) ) {
    if (assets[key].endsWith('.js')) {
      scripts.push(webpackConfig.output.publicPath + assets[key]);
    }
  }
} else {
  scripts.push('/bundle.js');
}
// import DocumentMeta from 'react-document-meta';

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */

export default class Html extends Component {
  static propTypes = {
    component: PropTypes.node,
    store: PropTypes.object,
    initialState: PropTypes.object
  }
  render() {
    const { component, store } = this.props;
    const componentHTML = component ? renderToString(component) : '';
    const initialState = store.getState();
    return (
      <html lang="en-us">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>hapi-react-starter-kit</title>
          <link rel="shortcut icon" href="/favicon.ico" />
        </head>
        <body>
          <div id="root" dangerouslySetInnerHTML={
            {
              __html: componentHTML
            }
          }/>
          <script
            dangerouslySetInnerHTML={
              {
                __html: `window.__INITIAL_STATE__ = ${ serialize(initialState) };`
              }
            }
          charSet="UTF-8"/>
          {
            scripts.map((src, i) => <script src={ src } key={ i } />)
          }
        </body>
      </html>
    );
  }
}
