import React, { Component, PropTypes } from 'react';
import radium from 'radium';

const styles = {
  base: {
    fontSize: 16,
    // backgroundColor: '#212121',
    background: 'linear-gradient( -90deg, rgb(255,94,58) 0%, rgb(255,42,104) 100%)',
    color: '#fff',
    border: 0,
    outline: 'none',
    height: '56px',
    width: '100%',

    '@media (min-width: 760px)': {
      height: '64px'
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
  },

  title: {
    color: '#fff',
    fontSize: '24px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '56px',
    marginLeft: '72px',
    textDecoration: 'none',

    '@media (min-width: 760px)': {
      lineHeight: '64px',
      marginLeft: '80px'
    }
  }
};

class AppBar extends Component {

  handleOnClick = event => {
    // TODO
  };

  render() {
    return (
      <div
        style={
          [
            styles.base,
            this.props.color === 'accent' && styles.accent,
            this.props.style
          ]
        }>
        <div>
          <a href={ this.props.title.to } style={ styles.title } onClick={ this.handleOnClick }>{ this.props.title.text }</a>
        </div>
        { this.props.children }
      </div>
    );
  }
}

AppBar.propTypes = {
  children: PropTypes.any,
  color: PropTypes.string,
  style: PropTypes.string,
  title: PropTypes.object
};

export default radium(AppBar);
