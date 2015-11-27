'use strict';

export default (theme) => {
  return {
    base: {
      border: 'none',
      borderBottom: 'solid 2px ' + theme.palette.accent1Color,
      position: 'absolute',
      width: '100%',
      bottom: 14,
      margin: 0,
      boxSizing: 'content-box',
      height: 0
    },
    disabled: {
      position: 'absolute',
      width: '100%',
      overflow: 'hidden',
      userSelect: 'none',
      cursor: 'default',
      bottom: 0,
      color: theme.palette.disabledColor
    },
    focus: {
      transform: 'scaleX(0)',
      transition: theme.transitions.easeOut ()
    }
  };
};
