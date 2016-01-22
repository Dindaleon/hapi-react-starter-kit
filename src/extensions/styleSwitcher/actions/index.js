export const SWITCH_THEME = 'SWITCH_THEME';

const switchTheme = theme => {
  return {
    type: SWITCH_THEME,
    theme
  };
};

export { switchTheme };
