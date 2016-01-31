import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
Promise.promisifyAll(fs);

// return a list of active extensions
const getActiveExtensions = () => {
  return new Promise( (resolve ) => {
    let extension = {
      name: null,
      reducerName: null,
      folderName: null
    };
    const activeExtensions = [];
    const extensionsPath = path.resolve(__dirname, '../extensions');
    fs.readdirAsync(extensionsPath).map( extensionFolderName => {
      const pathToExtension = path.resolve(extensionsPath, extensionFolderName);
      const stat = fs.statSync(pathToExtension);
      let activeExtension = null;
      let isActive = false;
      if (stat.isDirectory()) {
        try {
          isActive = require(pathToExtension).default.active;
        } catch (e) {
          // index not found.
        }
      }
      if (isActive) {
        activeExtension = extensionFolderName;
      }
      return activeExtension;
    }).then( folders => {
      for ( const folderName of folders ) {
        if (folderName !== null ) {
          extension = {
            name: folderName,
            reducerName: folderName,
            folderName: folderName
          };
          activeExtensions.push(extension);
        }
      }
      resolve(activeExtensions);
    });
  });
};

const getActiveExtensionsSync = () => {
  const activeExtensions = [];
  const extensionsPath = path.resolve(__dirname, '../extensions');
  const extensionFolderNames = fs.readdirSync(extensionsPath);
  extensionFolderNames.map( extensionFolderName => {
    const pathToExtension = path.resolve(extensionsPath, extensionFolderName);
    const stat = fs.statSync(pathToExtension);
    let isActive = false;
    if (stat.isDirectory()) {
      try {
        isActive = require(pathToExtension).default.active;
      } catch (e) {
        // index not found.
      }
    }
    if (isActive) {
      activeExtensions.push(extensionFolderName);
    }
  });
  return activeExtensions;
};

export { getActiveExtensionsSync };
export default getActiveExtensions;
