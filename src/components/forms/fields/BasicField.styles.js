'use strict';

export default (theme) => {
  return {
    base: {
      position: 'relative',
      width: '100%',
      border: 'none',
      outline: 'none',
      backgroundColor: 'transparent',
      color: theme.palette.textColor,
      font: 'inherit',
      ':focus': {} //needed!
    },
    iconfield: {
      padding: '.7em 2em .7em 1.7em'
    }
  };
};
