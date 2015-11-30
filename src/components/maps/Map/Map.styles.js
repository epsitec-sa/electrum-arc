'use strict';

module.exports = theme => {
  return {
    base: {
      width: '100%',
      minHeight: theme.spacing.desktopKeylineIncrement * 5
    },
    medium: {
      minHeight: '50%'
    },
    full: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%'
    }
  };
};
