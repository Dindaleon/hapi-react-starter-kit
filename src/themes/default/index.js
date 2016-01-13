// TODO: import files automatically
import AppBar from './AppBar';
import Button from './Button';
import Tab from './Tab';
import TextField from './TextField';

// TODO
export const primary = null;
export const accent = null;

export const body = {
  rules: {
    body: {
      margin: 0,
      fontFamily: 'Roboto, Helvetica, Arial, sans-serif!important'
    },
    mediaQueries: {
      '(max-width: 600px)': {
        body: {
          background: 'gray'
        }
      },
      '(max-width: 500px)': {
        body: {
          background: 'blue'
        },
        'p, h1': {
          color: 'white'
        }
      }
    }
  }
};

export const components = {
  AppBar,
  Button,
  Tab,
  TextField
};

const theme = {
  body,
  components
};

export {
  theme as default,
  AppBar,
  Button,
  Tab,
  TextField
};
