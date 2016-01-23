import React, { Component, PropTypes } from 'react';
import radium from 'radium';

class TextField extends Component {
  state = {
    selectedRoute: null,
    selectedElement: null,
    itemWidth: 0,
    offsetLeft: 0
  };

  componentWillMount() {
    const currentRoute = this.props.router.location.pathname;
    this.setState({ selectedRoute: currentRoute });
    // this._componentUpdateOnChange(currentRoute);
  };

  componentWillReceiveProps = () => {
    const currentRoute = this.props.router.location.pathname;
    this._componentUpdateOnChange(currentRoute);
  };

  componentDidUpdate = (prevProps, prevState) => {
    const currentRoute = this.props.router.location.pathname;
    const currentItem = document.querySelector('[data-to="' + currentRoute + '"]');
    let itemWidth = 0;
    let offsetLeft = 0;
    if ( currentItem !== null ) {
      itemWidth = currentItem.offsetWidth;
      offsetLeft = currentItem.offsetLeft;
    }
    if (prevState.itemWidth !== itemWidth) {
      this.setState({ itemWidth: itemWidth });
      this.setState({ offsetLeft: offsetLeft });
    }
  };

  _componentUpdateOnChange(currentRoute) {
    const currentItem = document.querySelector('[data-to="' + currentRoute + '"]');
    const oldItem = this.state.selectedElement;

    if (oldItem !== null) {
      oldItem.style.color = this.styles.base.color;
    }
    let itemWidth = 0;
    let offsetLeft = 0;

    if ( currentItem !== null ) {
      this.setState({ selectedElement: currentItem });
      itemWidth = currentItem.offsetWidth;
      offsetLeft = currentItem.offsetLeft;
      currentItem.style.color = this.styles.selectedItem.color;
    }
    this.setState({ itemWidth: itemWidth });
    this.setState({ offsetLeft: offsetLeft });
  };

  componentDidUpdate = (prevProps, prevState) => {
    const currentRoute = this.props.router.location.pathname;
    const currentItem = document.querySelector('[data-to="' + currentRoute + '"]');
    let itemWidth = 0;
    let offsetLeft = 0;
    if ( currentItem !== null ) {
      itemWidth = currentItem.offsetWidth;
      offsetLeft = currentItem.offsetLeft;
    }
    if (prevState.itemWidth !== itemWidth) {
      this.setState({ itemWidth: itemWidth });
      this.setState({ offsetLeft: offsetLeft });
    }
  };

  styles = {
    base: {
      fontFamily: 'Roboto, Helvetica, Arial, sans-serif!important',
      fontSize: 14,
      fontWeight: '500',
      backgroundColor: '#212121',
      color: 'rgba(255, 255, 255, .7)',
      position: 'relative',
      textTransform: 'uppercase',
      border: 'none',
      display: 'block',
      outline: 'none',
      overflowX: 'auto',
      whiteSpace: 'nowrap'
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
    selectedItem: {
      color: '#fff'
    }
  };

  getItemStyle = () => {
    const item = {
      margin: 0,
      border: 'none',
      color: 'rgba(255, 255, 255, .7)',
      cursor: 'pointer',
      display: 'inline-block',
      padding: '0 24px',
      position: 'relative',
      height: '48px',
      lineHeight: '48px',
      textDecoration: 'none'
    };
    return item;
  };

  getBottomBorder = () => {
    const offsetLeft = this.state.offsetLeft;
    const bottomBorder = {
      left: 'calc(' + offsetLeft + 'px)',
      width: this.state.itemWidth + 'px',
      bottom: 0,
      display: 'block',
      height: '2px',
      marginTop: '-2px',
      position: 'relative',
      transition: 'left 0.7s cubic-bezier(0.23, 1, 0.32, 1) 0ms, width 0.7s cubic-bezier(0.23, 1, 0.32, 1) 0ms',
      backgroundColor: '#D50000'
    };
    return bottomBorder;
  };

  handleClick = event => {
    event.preventDefault();
    this.setState({ selectedRoute: event.target.getAttribute('data-to') });
    this.props.pushState(null, event.target.getAttribute('data-to'));
  };

  render() {
    return (
      <div style={ this.styles.base }>
        {
          this.props.items.map( (menuItem, index) => {
            return <a key={ `menu.item${ index }` } href={ menuItem.to } style={ [ this.getItemStyle(), this.state.selectedItem === menuItem.to && this.styles.selectedItem ] } data-to={ menuItem.to } onClick={ this.handleClick }>{ menuItem.text }</a>;
          })
        }
        <div style={ this.getBottomBorder() } />
      </div>
    );
  };
};

TextField.propTypes = {
  children: PropTypes.any,
  color: PropTypes.string,
  items: PropTypes.array,
  onClick: PropTypes.func,
  pushState: PropTypes.func,
  router: PropTypes.object,
  style: PropTypes.string
};

export default radium(TextField);
