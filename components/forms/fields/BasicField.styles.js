'use strict';
var E = require ('e');

module.exports = {
  base: {
    width: '100%',
    display: 'block',
    fontFamily: E.typo.font,
    borderTopColor: E.palette.borderColor,
    borderTopStyle: 'solid',
    borderTopWidth: '1px',
    borderRightColor: E.palette.borderColor,
    borderRightStyle: 'solid',
    borderRightWidth: '1px',
    borderBottomColor: E.palette.borderColor,
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    borderLeftColor:E.palette.borderColor,
    borderLeftStyle: 'solid',
    borderLeftWidth: '1px',
    color: E.palette.textColor,
    background: E.palette.canvasColor,
    fontSize: '18px',
    fontWeight: 600,
    paddingLeft: '.7em',
    paddingRight: '.7em',
    paddingTop: '.2em',
    paddingBottom: '.2em',
    marginTop: '.1em',
    marginBottom: '.1em',
    ':hover': {
      boxShadow: '0 0 1em #999',
    }
  },
  iconfield: {
    outline: 'none',
    background: 'none',
    border: 'none',
    padding: '.7em 2em .7em 1.7em',
    marginTop: 'none',
    marginBottom: 'none',
    ':hover': {
      border: 'none',
      boxShadow: 'none',
    }
  }
};
