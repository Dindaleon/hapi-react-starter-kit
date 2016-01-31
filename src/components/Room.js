import React, { Component, PropTypes } from 'react';
import {
  defineMessages,
  FormattedMessage,
  FormattedRelative,
  injectIntl, intlShape
} from 'react-intl';
import Theme from '../themes';

const messages = defineMessages({
  rooms: {
    id: 'rooms.rooms',
    description: 'rooms',
    defaultMessage: 'Rooms'
  },
  messages: {
    id: 'rooms.messages',
    description: 'Messages word',
    defaultMessage: '{quantity} messages'
  },
  messagesSingular: {
    id: 'rooms.messagesSingular',
    description: 'Messages (singular)',
    defaultMessage: '{quantity} message'
  },
  sendMessageButton: {
    id: 'rooms.sendMessageButton',
    description: 'Send a message button',
    defaultMessage: 'Send!'
  },
  sendMessageInput: {
    id: 'rooms.sendMessageInput',
    description: 'Send a message input field',
    defaultMessage: 'Send a message'
  },
  userIsTyping: {
    id: 'rooms.userIsTyping',
    description: 'Message saying a user is typing.',
    defaultMessage: '{name} is typing...'
  }
});

class Room extends Component {

  state = {
    message: '',
    messages: [],
    isTyping: false,
    userTyping: null
  };

  componentDidMount() {
    const messages = [];
    this.props.loadMessages(this.props.roomId).then( action => {
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
  };

  onUserTyping = data => {
    if ( this.state.userTyping !== data.username ) {
      this.setState({ userTyping: data.username });
      this.userTypingTimeout = setTimeout(() => {
        this.setState({ userTyping: null });
      }, 5000);
    }
  };

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
      roomId: this.props.roomId,
      accessToken: user.accessToken,
      username: user.username,
      text: msg,
      time: new Date().getTime()
    });
    this.setState({ userTyping: null });
  };

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
  };

  render() {
    const { formatMessage } = this.props.intl;
    const messagesLength = this.state.messages.length;
    return (
      <div>
        <h3>
          {
            messagesLength === 1
            ?
            <FormattedMessage {...messages.messagesSingular} values={ { quantity: messagesLength } } />
            :
            <FormattedMessage {...messages.messages} values={ { quantity: messagesLength } } />
          }
        </h3>
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
          <Theme render="TextField" type="text" value={ this.state.message } onChange={ this.handleChange } placeholder={ formatMessage(messages.sendMessageInput) } />
          <Theme render="Button" onClick={ this.handleSubmit } ><FormattedMessage { ...messages.sendMessageButton } /></Theme>
        </form>
        <div>{ this.state.userTyping ? <FormattedMessage {...messages.userIsTyping} values={ { name: this.state.userTyping } } /> : '' }</div>
      </div>
    );
  }
}

Room.propTypes = {
  intl: intlShape.isRequired,
  loadMessages: PropTypes.func.isRequired,
  roomId: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired
};

export default injectIntl(Room);
