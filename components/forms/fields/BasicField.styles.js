'use strict';


module.exports = {
  base: {
    width: '100%',
    fontFamily: '"Open Sans", sans-serif',
    borderTopColor: 'rgb(180, 178, 178)',
    borderTopStyle: 'solid',
    borderTopWidth: '1px',
    borderRightColor: 'rgb(180, 178, 178)',
    borderRightStyle: 'solid',
    borderRightWidth: '1px',
    borderBottomColor: 'rgb(180, 178, 178)',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    borderLeftColor: 'rgb(180, 178, 178)',
    borderLeftStyle: 'solid',
    borderLeftWidth: '1px',
    color: '#858282',
    background: '#fff',
    fontSize: '18px',
    fontWeight: 600,
    paddingLeft: '.7em',
    paddingRight: '.7em',
    paddingTop: '.2em',
    paddingBottom: '.2em',
    marginTop: '.1em',
    marginBottom: '.1em',
    ':hover': {
      borderTopColor: 'rgb(153, 153, 153)',
      borderRightColor: 'rgb(153, 153, 153)',
      borderBottomColor: 'rgb(153, 153, 153)',
      borderLeftColor: 'rgb(153, 153, 153)',
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
