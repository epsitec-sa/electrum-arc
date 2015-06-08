'use strict';
var E = require ('e');

module.exports = {
  base: {
    display: 'inline-block',
    fontSize: '18px',
    fontFamily: E.typo.font,
    fontWeight: 400,
    transition: '.1s all',
    cursor: 'pointer',
    outline: 'none',
    marginTop: '3px',
    width: '100%',
    border: 'none',
    paddingLeft: '5px',
    paddingRight: '5px',
    paddingTop: '5px',
    paddingBottom: '5px',
    color: E.palette.textColor,
    backgroundColor: E.palette.primary1Color,
    borderRadius: '100px',
    ':hover': {
      backgroundColor: E.palette.primary3Color,
    }
  },
  small: {
    width: 'none',
    paddingLeft: '15px',
    paddingRight: '15px'
  },
  accept: {
    fontWeight: 'bold',
  },
  cancel: {
    fontStyle: 'italic',
  }
};
