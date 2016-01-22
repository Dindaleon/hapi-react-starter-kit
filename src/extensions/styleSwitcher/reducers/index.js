import { SWITCH_THEME } from '../actions';

const  initialState = { currentTheme: 'default' };

const styleSwitcher = (state = initialState, action = {}) => {
  switch (action.type) {
    case SWITCH_THEME: {
      return Object.assign({}, state, {
        currentTheme: action.theme
      });
    }
    default:
      return state;
  }
};

export default styleSwitcher;
