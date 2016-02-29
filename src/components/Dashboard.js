import React, { Component, PropTypes } from 'react';
import update from 'react-addons-update';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import Promise from 'bluebird';
import fetch from 'isomorphic-fetch';

import Theme from '../themes';
Promise.promisifyAll(fetch);

const messages = defineMessages({
  createRoomButton: {
    id: 'rooms.createButton',
    description: 'Create Rooms button',
    defaultMessage: 'Create Room'
  },
  updateUserButton: {
    id: 'user.updateButton',
    description: 'User Update button',
    defaultMessage: 'Update User'
  }
});

export default class Dashboard extends Component {

  state = {
    user: {
      id: this.props.user.id,
      name: this.props.user.username,
      email: this.props.user.email
    },
    room: {
      name: ''
    },
    lists: {
      rooms: []
    }
  };

  componentDidMount() {
    const query = {
      owner: parseInt(this.state.user.id, 10)
    };
    this.props.list( query ).then( action => {
      if ( typeof action.result !== 'undefined' ) {
        this.setState({ lists: { rooms: action.result.data }});
      }
    });
  }

  handleSubmitUserUpdate = event => {
    event.preventDefault();
    const { user } = this.props;
    const _user = {
      id: this.state.user.id,
      username: this.state.user.name,
      email: this.state.user.email,
      accessToken: user.accessToken
    };
    this.props.update( _user ).then(() => {
      // User updated...
      // Do stuff after updating user
    });
  };

  handleSubmitCreateRoom = event => {
    event.preventDefault();
    const { user } = this.props;
    const _user = {
      id: this.state.user.id,
      accessToken: user.accessToken
    };
    const roomName = this.state.room.name;
    this.setState({ room: { name: '' }});
    const _room = {
      name: roomName
    };

    this.props.createRoom( _user, _room ).then( action => {
      if ( typeof action.result === 'undefined') {
        // Handle error
        // console.log('User\'s credentials have expired.');
      } else {
        const rooms = this.state.lists.rooms;
        rooms.push({
          id: action.result.data.id,
          name: action.result.data.name
        });
        this.setState({ lists: { rooms }});
      }
    });
  };

  handleChangeUser = event => {
    this.setState(
      update(this.state,
        { user: { [event.target.name]: { $set: event.target.value }}}
      )
    );
  };

  handleChangeRoom = event => {
    this.setState(
      update(this.state,
        { room: { [event.target.name]: { $set: event.target.value }}}
      )
    );
  };

  render() {
    return (
      <div>
        Edit user:
        <form onSubmit={ this.handleSubmitUserUpdate }>
          <Theme render="TextField" type="text"
                 name="name"
                 placeholder={ this.state.user.name }
                 value={ this.state.user.name }
                 onChange={ this.handleChangeUser } />
          <Theme render="TextField" type="text"
                 name="email"
                 placeholder={ this.state.user.email }
                 value={ this.state.user.email }
                 onChange={ this.handleChangeUser } />
          <Theme render="Button" type="button"
                 onClick={ this.handleSubmitUserUpdate }>
            <FormattedMessage { ...messages.updateUserButton } />
          </Theme>
        </form>
        Create room:
        <form onSubmit={ this.handleSubmitCreateRoom }>
          <Theme render="TextField" type="text"
                 name="name"
                 placeholder={ this.state.room.name }
                 value={ this.state.room.name }
                 onChange={ this.handleChangeRoom } />
          <Theme render="Button" type="button"
                 onClick={ this.handleSubmitCreateRoom }>
            <FormattedMessage { ...messages.createRoomButton } />
          </Theme>
        </form>
        <ul>
          { typeof this.state.lists.rooms.map === 'function' ?
            this.state.lists.rooms.map( ( room, index ) => {
              return (
                <li key={ `lists.room.${index}` }>
                  <Link to={ '/room/' + room.id }>{ room.name }</Link>
                </li>
              );
            })
          : null }
        </ul>
      </div>
    );
  }
}

Dashboard.propTypes = {
  user: PropTypes.object.isRequired,
  rooms: PropTypes.object.isRequired,
  createRoom: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  list: PropTypes.func.isRequired
};
