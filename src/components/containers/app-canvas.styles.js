'use strict';

export default function styles (theme, props) {
  const appStyle = {
    position: 'fixed',
    userSelect: 'none',
    includes: ['fullSize'],
    backgroundColor: theme.palette.canvasColor,
    // Vendor prefix webkit-* has to be capitalized:
    WebkitFontSmoothing: 'antialiased'
  };

  return {
    app: appStyle
  };
}
