// TODO
import config from '../config';
const themeName = config.app.theme.name;

// In case an element does not exist
// fallback to a default one
const _defaultTheme = 'default';

const defaultTheme = require('./' + _defaultTheme + '/index');
const currentTheme = require('./' + themeName + '/index');

for (const key of Object.keys(defaultTheme.components)) {
  if ( typeof currentTheme.components[key] === 'undefined') {
    currentTheme.components[key] = defaultTheme.components[key];
  }
}

const AppBar = currentTheme.components.AppBar;
const Button = currentTheme.components.Button;
const Tab = currentTheme.components.Tab;
const TextField = currentTheme.components.TextField;

export const body = currentTheme.body;

export {
  currentTheme as default,
  AppBar,
  Button,
  Tab,
  TextField
};
