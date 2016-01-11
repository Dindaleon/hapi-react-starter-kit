import React, { Component, PropTypes } from 'react';
import radium from 'radium';

const styles = {
  base: {
    fontSize: 16,
    backgroundColor: 'none',
    color: '#000',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: '0.3em',
    padding: '0.4em 1em',
    margin: '2px',
    outline: 'none',

    '@media (min-width: 992px)': {
      padding: '0.6em 1.2em'
    },

    '@media (min-width: 1200px)': {
      padding: '0.8em 1.5em'
    },

    ':hover': {
      //backgroundColor: 'none'
    },

    ':focus': {
    //  borderColor: '#000000'
    border: '2px solid #2196F3',
    margin: '1px',
    },

    ':active': {
      //backgroundColor: '#005299',
      border: '2px solid #2196F3',
      margin: '1px',
      //transform: 'translateY(2px)',
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
  state = { hasValue: '' }

  _handleInputChange = (e) => {
    this.setState({ hasValue: e.target.value });
    if (this.props.onChange) this.props.onChange(e);
  }
  render() {
    return (
      <input
        style={
          [
            styles.base,
            this.props.color === 'accent' && styles.accent,
            this.props.style
          ]
        }
        type={ this.props.type }
        name={ this.props.name }
        placeholder={ this.props.placeholder }
        onChange={ this._handleInputChange } />
    );
  }
}

TextField.propTypes = {
  children: PropTypes.object,
  color: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  style: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string
};

export default radium(TextField);
