'use strict';

/******************************************************************************/

export default function (theme) {
  return {
    base: {
      fontFamily: theme.typo.font,
      color: theme.palette.textColor,
      fontSize: '.7em',
      padding: '1em',
      cursor: 'pointer',
      userSelect: 'none'
    },

    menuHead: {
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      display: 'inline-block',
      zoom: 1,
      verticalAlign: 'middle',
      padding: 0,
      margin: 0,
      fontWeight: 100,
      fontSize: '1.5em'
    },

    menuItem: {
      display: 'inline-block',
      zoom: 1,
      verticalAlign: 'middle',
      padding: 0,
      margin: 0,
      fontWeight: 100,
      fontSize: '.8em'
    }
  };
}

/******************************************************************************/
