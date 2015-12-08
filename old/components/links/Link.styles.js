'use strict';

module.exports = theme => {
  return {
    base: {
      fontFamily: theme.typo.font,
      color: theme.palette.textColor,
      fontSize: '.7em',
      padding: '1em',
      cursor: 'pointer',
      userSelect: 'none'
    },
    footer: {

    },
    'menu-heading': {
      fontWeight: 100,
      fontSize: '1.5em'
    },
    'menu-item': {
      fontWeight: 100,
      fontSize: '.8em'
    }
  };
};
