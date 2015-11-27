'use strict';

module.exports = theme => {
  return {
    base: {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      backgroundColor: theme.palette.canvasColor,
      WebkitFontSmoothing: 'antialiased'
    }
  };
};
