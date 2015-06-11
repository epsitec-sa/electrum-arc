'use strict';
var E = require ('e');

module.exports = {
  base: {
    fontFamily: E.typo.font,
    color: E.palette.textColor,
    fontSize: '.7em',
    padding: '1em',
    cursor: 'pointer',
    userSelect: 'none',
    ':hover':{
      color: E.palette.accent3Color,
    }
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
