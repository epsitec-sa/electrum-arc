'use strict';

/******************************************************************************/

export default function (theme) {
  return {
    base: {
      fontFamily: theme.typo.font,
      boxSizing: 'border-box',
      boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.26)',
      whiteSpace: 'nowrap',
      width: '100%',
      marginBottom: 5,
      backgroundColor: theme.palette.primary1Color
    }
  };
}

/******************************************************************************/
