import React, { Component, PropTypes } from 'react';
import radium from 'radium';

const styles = {
  base: {
    fontSize: 16,
    // background: 'linear-gradient( -90deg, rgb(255,94,58) 0%, rgb(255,42,104) 100%)',
    background: '#2196F3',
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
  },
  boxi: {
    transition: 'transform 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, opacity 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    boxSizing: 'border-box',
    tapHighlightColor: 'rgba(0, 0, 0, 0)',
    boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.239216) 0px 1px 4px',
    borderRadius: '2px',
    opacity: 1,
    transform: 'scaleY(1)',
    transformOrigin: 'left top 0px',
    position: 'fixed',
    zIndex: 2100,
    maxHeight: '349px',
    overflowY: 'auto',
    top: '141.188px',
    left: '352px',
    backgroundColor: 'rgb(255, 255, 255)'
  },
  span: {
    color: '#000',
    cursor: 'pointer',
    padding: '2px 24px',
    width: '300px'
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
        {/*<div style={ styles.boxi }>
          <span style={ styles.span}>item one</span>
        </div>  */}      
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
