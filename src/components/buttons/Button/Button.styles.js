'use strict';

import {E} from 'electrum';

module.exports = {
  base: {
    display: 'inline-block',
    fontSize: '18px',
    fontFamily: E.typo.font,
    fontWeight: 400,
    textTransform: 'uppercase',
    cursor: 'pointer',
    userSelect: 'none',
    outline: 'none',
    marginTop: '3px',
    minWidth: E.spacing.desktopKeylineIncrement * 2,
    border: 'none',
    paddingLeft: '5px',
    paddingRight: '5px',
    paddingTop: '5px',
    paddingBottom: '5px',
    color: E.palette.textColor,
    backgroundColor: E.palette.primary1Color,
    borderRadius: E.shapes.defaultBorderRadius,
    ':hover': {
      backgroundColor: E.palette.primary3Color,
    },
    ':focus': {
      backgroundColor: E.palette.primary3Color,
    },
    ':active': {
      backgroundColor: E.palette.primary3Color,
    }
  },
  small: {
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
