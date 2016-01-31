import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { defineMessages, FormattedMessage } from 'react-intl';

const messages = defineMessages({
  rooms: {
    id: 'rooms.rooms',
    description: 'rooms',
    defaultMessage: 'Rooms'
  },
  noRoomsAvailable: {
    id: 'rooms.noRoomsAvailable',
    description: 'No more rooms available.',
    defaultMessage: 'No rooms available.'
  }
});

export default class Hall extends Component {

  state = {
    lists: {
      rooms: []
    }
  };

  componentDidMount() {
    this.props.list().then( action => {
      this.setState({ lists: { rooms: action.result.data }});
    });
  }

  render() {
    return (
      <div>
        { this.state.lists.rooms.length } <FormattedMessage {...messages.rooms} />
        <ul>
        {
         typeof this.state.lists.rooms.map === 'function'
        ?
          this.state.lists.rooms.map( (room, index) => {
            return <li key={ `lists.room.${ index }` }><Link to={ '/room/' + room.id }>{ room.name }</Link></li>;
          })
        :
          <FormattedMessage {...messages.noRoomsAvailable} />
        }
        </ul>
      </div>
    );
  }
}

Hall.propTypes = {
  list: PropTypes.func.isRequired,
  loadMessages: PropTypes.func.isRequired,
  rooms: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};
