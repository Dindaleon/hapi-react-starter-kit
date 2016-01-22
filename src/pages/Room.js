import React, { Component, PropTypes } from 'react';
import { StyleRoot } from 'radium';
import Helmet from 'react-helmet';
import Room from '../containers/RoomContainer';

export default class HallPage extends Component {
  state = {
    roomId: 0
  }
  componentWillMount() {
    this.setState({ roomId: this.props.params.id });
  }

  render() {
    const title = 'Room ' + this.state.roomId;
    return (
      <StyleRoot id="room">
        <Helmet title={ title } />
        <Room roomId={ this.state.roomId } />
      </StyleRoot>
    );
  }
}

HallPage.propTypes = {
  params: PropTypes.object.isRequired
};
