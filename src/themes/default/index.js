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
      fontFamily: 'Roboto, Helvetica, Arial, sans-serif!important',
      background: 'linear-gradient(top,  #3f77a4, #8bb6d0, #6e80b8 70%, #26447c)',
      // The following attributes are for testing purposes
      // to check Radium's auto prefixer
      flexDirection: 'column',
      alignItems: 'stretch',
      flexShrink: 0,
      alignContent: 'flex-start',
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

// TODO Layouts
// eg: three columns, wide, stretch

// Theme Components
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
