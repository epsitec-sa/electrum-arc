'use strict';
var E = require ('e');

module.exports = {
  base: {
    backgroundColor: E.palette.paperColor,
    transition: E.transitions.easeOut (),
    boxSizing: 'border-box',
    fontFamily: E.typo.font,
    color: E.palette.textColor,
    borderRadius: E.shapes.defaultBorderRadius,
    overflowX: 'hidden',
    border: E.paperDebugColor
  },
  view: {
    backgroundColor: E.palette.canvasColor,
    height: '100%'
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
  glowitem: {
    width: '100%',
    paddingTop: '.1em',
    paddingRight: '.2em',
    paddingBottom: '.1em',
    paddingLeft: '.2em',
    marginTop: '.1em',
    marginRight: '.2em',
    marginBottom: '.1em',
    marginLeft: '.2em',
    ':hover': {
      backgroundColor: E.palette.accent1Color
    }
  },
  header: {
    backgroundColor: E.palette.primary1Color,
    width: '100%',
    paddingTop: '.5em',
    paddingRight: '.5em',
    paddingBottom: '.5em',
    paddingLeft: '.5em'
  }
};
