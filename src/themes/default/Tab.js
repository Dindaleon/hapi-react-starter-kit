import React, { Component, PropTypes } from 'react';
import radium from 'radium';
import { Link } from 'react-router';

const styles = {
  base: {
    fontSize: 16,
    backgroundColor: 'none',
    color: '#000',
    border: 'none',
    borderRadius: '0.3em',
    padding: '0.4em 1em',
    margin: '2px',
    outline: 'none',
    overflowX: 'auto',

    '@media (min-width: 992px)': {
      padding: '0.6em 1.2em'
    },

    '@media (min-width: 1200px)': {
      padding: '0.8em 1.5em'
    }
  },

  item: {
    margin: 0,
    border: 'none',
    padding: '0 24px',
    height: '48px',
    lineHeight: '48px',
    textDecoration: 'none',

    ':hover': {
      backgroundColor: '#2196F3'
    },

    ':focus': {
      border: '2px solid #2196F3',
      margin: '1px',
    },

    ':active': {
      border: '2px solid #2196F3',
      margin: '1px',
    }
  },

  accent: {
    backgroundColor: '#d90000',

    ':hover': {
      backgroundColor: '#FF0000'
    },
    ':focus': {
      backgroundColor: '#FF0000'
    },
    ':active': {
      backgroundColor: '#990000'
    }
  }
};

class TextField extends Component {
  render() {
    return (
      <div style={ styles.base }>
       {
        this.props.items.map( (menuItem, index) => {
          return <Link key={ `menu.item${ index }` } style={ styles.item } to={ menuItem.to }>{ menuItem.text }</Link>;
        })
      }
      </div>
    );
  }
}

TextField.propTypes = {
  children: PropTypes.any,
  color: PropTypes.string,
  items: PropTypes.array,
  onClick: PropTypes.func,
  style: PropTypes.string
};

export default radium(TextField);
