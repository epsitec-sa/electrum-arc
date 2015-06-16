'use strict';
var E = require ('e');

module.exports = {
  base: {
    border: 'none',
    borderBottom: 'solid 2px ' + E.palette.accent1Color,
    position: 'absolute',
    width: '100%',
    bottom: 4,
    margin: 0,
    boxSizing: 'content-box',
    height: 0
  },
  disabled: {
    position: 'absolute',
    width: '100%',
    overflow: 'hidden',
    userSelect: 'none',
    cursor: 'default',
    bottom: 0,
    color: E.palette.disabledColor
  },
  focus: {
    transform: 'scaleX(0)',
    transition: E.transitions.easeOut ()
  }
};
