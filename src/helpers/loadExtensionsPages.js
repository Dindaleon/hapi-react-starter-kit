/*
 * loadExtensionsPages
 * receives default routes and active extensions
 * checks each active extension and grabs those
 * who contain pages
 * then, patches default routes with extensions routes
 */
const customRequire = path => {
  let req = null;
  if (__SERVER__) {
    req = require('../extensions' + path);
  } else {
    const r = require.context('../extensions', true);
    req = r('.' + path);
  }
  return req;
};

const loadExtensionsPages = (routeConfig, activeExtensions) => {
  const extensionsPages = [];
  for (const extension of activeExtensions) {
    try {
      const extensionPages = customRequire('/' + extension.folderName + '/pages/index').default;
      // console.log('check this extension ' + extension.folderName + ' pages: ', extensionPages);
      extensionsPages.push(extensionPages);
    } catch (e) {
      // console.log('This extension does not contain pages.');
    }
  }
  for (const extensionPages of extensionsPages) {
    for ( const page of extensionPages ) {
      if (page.scope === 'registered') {
        routeConfig[0].childRoutes[2].childRoutes.push({ path: page.path, component: page.component });
      } else if ( page.scope === 'loggedOut') {
        routeConfig[0].childRoutes[1].childRoutes.push({ path: page.path, component: page.component });
      } else {
        routeConfig[0].childRoutes.push({ path: page.path, component: page.component });
      }
    }
  }
  return routeConfig;
};

export default loadExtensionsPages;
