'use strict';

module.exports = {
  base: {
    fontSize: '18px',
    display: 'inline-block',
    fontWeight: 400,
    color: '#fff',
    transition: '.1s all',
    cursor: 'pointer',
    outline: 'none',
    marginTop: '3px',
    fontFamily: 'Open Sans, sans-serif',
    width: '100%',
    border: 'none',
    paddingLeft: '5px',
    paddingRight: '5px',
    paddingTop: '5px',
    paddingBottom: '5px',
    background: '#87ac78',
    borderRadius: '100px',
    ':hover': {
      background: '#9cc78a'
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
