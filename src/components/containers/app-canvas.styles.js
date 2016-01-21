'use strict';

export default function (theme) {
  return {
    base: {
      position: 'fixed',
      includes: ['fullSize'],
      backgroundColor: theme.palette.canvasColor,
      webkitFontSmoothing: 'antialiased'
    }
  };
}
