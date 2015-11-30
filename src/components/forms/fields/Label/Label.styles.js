'use strict';

module.exports = theme => {
  return {
    base: {
      fontSize: 16,
      marginLeft: 10,
      lineHeight: '1em',
      color: theme.palette.textColor,
      fontFamily: theme.typo.font,
      fontWeight: 600
    }
  };
};
