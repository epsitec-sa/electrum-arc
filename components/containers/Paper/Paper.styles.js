'use strict';
var E = require ('e');

module.exports = {
  base: {
    backgroundColor: E.palette.paperColor,
    transition: E.transitions.easeOut (),
    boxSizing: 'border-box',
    fontFamily: E.typo.font,
    color: E.palette.textColor,
    borderRadius: E.shapes.defaultBorderRadius
  },
  view: {
    backgroundColor: E.palette.canvasColor,
    paddingTop: '1em',
    paddingRight: '1em',
    paddingBottom: '1em',
    paddingLeft: '1em'
  },
  full: {
    width: '100%',
    paddingTop: '1em',
    paddingRight: '1em',
    paddingBottom: '1em',
    paddingLeft: '1em',
    marginTop: '.5em',
    marginRight: '.5em',
    marginBottom: '.5em',
    marginLeft: '.5em'
  },
  header: {
    backgroundColor: E.palette.primary1Color,
    width: '100%',
    paddingTop: '1em',
    paddingRight: '1em',
    paddingBottom: '1em',
    paddingLeft: '1em'
  }
};
