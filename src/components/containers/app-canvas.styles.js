'use strict';

export default function (theme) {
  return {
    base: {
      position: 'fixed',
      includes: ['fullSize'],
      backgroundColor: theme.palette.canvasColor,
      // Vendor prefix webkit-* has to be capitalized:
      WebkitFontSmoothing: 'antialiased'
    }
  };
}
