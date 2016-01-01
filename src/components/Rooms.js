import React, { Component, PropTypes } from 'react';
import { defineMessages, FormattedMessage, FormattedRelative } from 'react-intl';

const messages = defineMessages({
  rooms: {
    id: 'rooms.rooms',
    description: 'rooms',
    defaultMessage: 'Rooms'
  },
  messages: {
    id: 'rooms.messages',
    description: 'messages',
    defaultMessage: 'Messages'
  },
  userIsTyping: {
    id: 'rooms.userIsTyping',
    description: 'Message saying a user is typing.',
    defaultMessage: '{name} is typing...'
  }
});
export default class Room extends Component {

  state = {
    roomId: 0,
    message: '',
    messages: [],
    isTyping: false,
    userTyping: null,
  }

  componentWillMount() {
    this.setState({ roomId: this.props.params.id });
  }
  componentDidMount() {
    const messages = [];
    this.props.loadMessages(this.state.roomId).then( action => {
      action.result.data.messages.map( messageObject => {
        messages.push({
          'username': messageObject.username,
          'text': messageObject.text,
          'time': messageObject.time
        });
      });
      this.setState({ messages });
    });

    if ( socket ) {
      socket.on('msg', this.onMsgReceived);
      socket.on('typing', this.onUserTyping);
    }
  }

  componentWillUnmount() {
    // Remove socket listeners
    // and timeouts on Unmount
    if ( socket ) {
      socket.removeListener('msg', this.onMsgReceived);
      socket.removeListener('typing', this.onUserTyping);
    }
    clearTimeout( this.typingTimeout );
    clearTimeout( this.userTypingTimeout );
  }

  onMsgReceived = data => {
    const messages = this.state.messages;
    messages.push(data);
    this.setState({ messages });
  }

  onUserTyping = data => {
    if ( this.state.userTyping !== data.username ) {
      this.setState({ userTyping: data.username });
      this.userTypingTimeout = setTimeout(() => {
        this.setState({ userTyping: null });
      }, 5000);
    }
  }

  handleSubmit = event => {
    const { user } = this.props;
    event.preventDefault();
    const msg = this.state.message;
    if ( msg === '' ) {
      // Handle user input message error
      console.log('Message cant be empty');
      return;
    }

    this.setState({ message: '' });
    // Check is user is allowed to submit a message
    if ( typeof user.accessToken === 'undefined' || user.accessToken === null ) {
      // Handle error for non authenticated user
      console.log('accessToken Not Found!');
      return;
    }
    socket.emit('msg', {
      roomId: this.props.params.id,
      accessToken: user.accessToken,
      username: user.username,
      text: msg,
      time: new Date().getTime()
    });
    this.setState({ userTyping: null });
  }

  handleChange = event => {
    this.setState({ message: event.target.value });
    if (this.props.user.username !== this.state.userTyping) {
      this.setState({ isTyping: false });
    }
    if (!this.state.isTyping) {
      socket.emit('typing', {
        username: this.props.user.username
      });
      this.setState({ isTyping: true });
      this.typingTimeout = setTimeout(() => {
        this.setState({ isTyping: false });
      }, 5000);
    }
  }

  render() {
    return (
      <div id="room">
          { this.state.messages.length } <FormattedMessage {...messages.messages} />
        <ul>
        {
          this.state.messages.length !== 0
        ?
          this.state.messages.map( (msg, index) => {
            return <li key={ `room.msg.${ index }` }>{ msg.username }: { msg.text } <FormattedRelative value={ msg.time } /></li>;
          })
        :
          'This room has no messages.'
        }
        </ul>
        <form onSubmit={ this.handleSubmit }>
          <input type="text" value={ this.state.message } onChange={ this.handleChange } placeholder="send a message:" />
          <input type="button" value="Send!" onClick={ this.handleSubmit } />
        </form>
        <div>{ this.state.userTyping ? <FormattedMessage {...messages.userIsTyping} values={{ name: this.state.userTyping }} /> : '' }</div>
      </div>
    );
  }
}

Room.propTypes = {
  loadMessages: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};
