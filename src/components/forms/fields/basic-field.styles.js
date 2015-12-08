'use strict';

export default function (theme) {
  return {
    base: {
      position: 'relative',
      width: '100%',
      border: 'none',
      outline: 'none',
      backgroundColor: 'transparent',
      color: theme.palette.textColor,
      font: theme.typo.font,
      /* ':focus': {} // needed! */
    }
  };
}
