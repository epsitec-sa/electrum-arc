'use strict';

module.exports = theme => {
  return {
    base: {
      fontSize: 18,
      fontFamily: theme.typo.font,
      background: theme.palette.primary2Color,
      textAlign: 'center',
      padding: '1em 2em'
    }
  };
};
