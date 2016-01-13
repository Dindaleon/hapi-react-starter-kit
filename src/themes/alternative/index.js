// TODO: import files automatically
import AppBar from './AppBar';
import Button from './Button';
import Tab from './Tab';

// TODO
export const primary = null;
export const accent = null;

export const body = {
  rules: {
    body: {
      backgroundColor: '#303030',
      color: '#fff',
      margin: 0,
      fontFamily: 'Roboto, Helvetica, Arial, sans-serif!important'
    },
    mediaQueries: {
      '(max-width: 600px)': {
        body: {
          backgroundColor: 'gray'
        }
      },
      '(max-width: 500px)': {
        body: {
          backgroundColor: 'blue'
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
  Tab
};

const theme = {
  body,
  components
};

export {
  theme as default,
  AppBar,
  Button,
  Tab
};
