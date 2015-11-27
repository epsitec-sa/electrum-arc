'use strict';

export default (theme) => {
  return {
    base: {
      fontSize: 14,
      color: theme.palette.textColor
    },
    title: {
      fontSize: 24
    },
    subtitle: {
      color: theme.palette.subTextColor,
    }
  };
};
