import customRequire from '../helpers/customRequire';

const es = require('./es').default;
const it = require('./it').default;

const coreLanguages = {
  'es': es,
  'it': it
};

module.exports = {
  extended: (activeExtension) => {
    const languagesExtended = {};
    languagesExtended.es = Object.assign({}, coreLanguages.es);
    languagesExtended.it = Object.assign({}, coreLanguages.it);
    for ( const extension of activeExtension ) {
      try {
        const extensionLanguages = customRequire('/' + extension.folderName + '/lang/index').default;
        for (const extensionLanguage of extensionLanguages) {
          languagesExtended[extensionLanguage.locale] = Object.assign(
            {},
            languagesExtended[extensionLanguage.locale],
            extensionLanguage[extensionLanguage.locale] = extensionLanguage.file
          );
        }
      } catch (e) {
        // console.log('This extension ' + extension.folderName + ' does not have translations.');
      }
    }
    return languagesExtended;
  }
};
