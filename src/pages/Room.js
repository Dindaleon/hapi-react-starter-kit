import React, { Component, PropTypes } from 'react';
import { StyleRoot } from 'radium';
import Helmet from 'react-helmet';
import Room from '../containers/RoomContainer';

export default class HallPage extends Component {
  state = {
    roomId: 0
  };

  componentWillMount() {
    this.setState({ roomId: this.props.params.id });
  }

  render() {
    const { roomId } = this.state;
    const title = 'Room ' + roomId;
    return (
      <StyleRoot id="room">
        <Helmet title={ title } />
        <Room roomId={ roomId } />
      </StyleRoot>
    );
  }
}

HallPage.propTypes = {
  params: PropTypes.object.isRequired
};
