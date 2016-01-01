import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Promise from 'bluebird';
import fetch from 'isomorphic-fetch';
import update from 'react-addons-update';

Promise.promisifyAll(fetch);
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
      rooms: this.props.rooms.data.lists || []
    }
  }
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
  }

  handleSubmitCreateRoom = event => {
    event.preventDefault();
    const { user } = this.props;
    const _user = {
      id: this.state.user.id,
      accessToken: user.accessToken
    };

    const _room = {
      name: this.state.room.name
    };

    this.props.createRoom( _user, _room ).then( action => {
      if ( typeof action.result === 'undefined') {
        // Handle error
        console.log('User\'s credentials have expired.');
      } else {
        const rooms = this.state.lists.rooms;
        rooms.push({
          id: action.result.data.id,
          name: action.result.data.name
        });
        this.setState({ lists: { rooms }});
      }
    });
  }

  handleChangeUser = event => {
    this.setState(
      update(this.state,
        { user: { [event.target.name]: { $set: event.target.value }}}
      )
    );
  }

  handleChangeRoom = event => {
    this.setState(
      update(this.state,
        { room: { [event.target.name]: { $set: event.target.value }}}
      )
    );
  }

  render() {
    return (
      <div>
        <h1>Dashboard</h1>
        <p>You made it!</p>
        Edit user:
        <form onSubmit={ this.handleSubmitUserUpdate }>
          <input type="text"
                 name="name"
                 placeholder={ this.state.user.name }
                 value={ this.state.user.name }
                 onChange={ this.handleChangeUser } />
          <input type="text"
                 name="email"
                 placeholder={ this.state.user.email }
                 value={ this.state.user.email }
                 onChange={ this.handleChangeUser } />
          <input type="button"
                 value="Update User"
                 onClick={ this.handleSubmitUserUpdate } />
        </form>
        Create room:
        <form onSubmit={ this.handleSubmitCreateRoom }>
          <input type="text"
                 name="name"
                 placeholder={ this.state.room.name }
                 value={ this.state.room.name }
                 onChange={ this.handleChangeRoom } />
          <input type="button"
                 value="Create room"
                 onClick={ this.handleSubmitCreateRoom } />
        </form>
        <ul>
        { typeof this.state.lists.rooms.map === 'function' ?
          this.state.lists.rooms.map( (room, index) => {
            return <li key={ `lists.room.${ index }` }><Link to={ '/rooms/' + room.id }>{ room.name }</Link></li>;
          }) : ''
        }
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
