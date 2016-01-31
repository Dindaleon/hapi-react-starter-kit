export const LOAD_MESSAGES = 'LOAD_MESSAGES';
export const LOAD_MESSAGES_SUCCESS = 'LOAD_MESSAGES_SUCCESS';
export const LOAD_MESSAGES_FAILURE = 'LOAD_MESSAGES_FAILURE';
export const RESET_MESSAGES = 'RESET_MESSAGES';
export const RESET_MESSAGES_SUCCESS = 'RESET_MESSAGES_SUCCESS';
export const RESET_MESSAGES_FAILURE = 'RESET_MESSAGES_FAILURE';
export const CLEAN_ROOMS_LIST = 'CLEAN_ROOMS_LIST';
export const CREATE_ROOM = 'CREATE_ROOM';
export const CREATE_ROOM_SUCCESS = 'CREATE_ROOM_SUCCESS';
export const CREATE_ROOM_FAILURE = 'CREATE_ROOM_FAILURE';
export const LIST_ROOM = 'LIST_ROOM';
export const LIST_ROOM_SUCCESS = 'LIST_ROOM_SUCCESS';
export const LIST_ROOM_FAILURE = 'LIST_ROOM_FAILURE';

export const loadMessages = ( id ) => {
  return {
    type: [ LOAD_MESSAGES ],
    promise: ( client ) => client.get('/rooms/' + id + '/messages', {
      params: {
        id
      }
    })
  };
};

export const resetLoad = () => {
  return {
    type: [ RESET_MESSAGES ]
  };
};

export const cleanRoomsList = () => {
  return {
    type: CLEAN_ROOMS_LIST
  };
};

export const createRoom = ( user, room ) => {
  return {
    type: [ CREATE_ROOM ],
    promise: ( client ) => client.post('/rooms', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': user.accessToken,
      },
      params: {
        authorization: true
      },
      data: {
        userId: parseInt(user.id, 10),
        roomName: room.name
      }
    })
  };
};

export const list = ( query ) => {
  return {
    type: [ LIST_ROOM ],
    promise: ( client ) => client.get('/rooms/list', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      query
    })
  };
};

export const ischatLoaded = ( globalState ) => {
  return globalState.chat && globalState.chat.loaded;
};

export const isListLoaded = ( globalState ) => {
  return globalState.chat && globalState.chat.listed;
};
