'use strict';

import {E} from 'electrum';

module.exports = {
  base: {
    width: '100%',
    minHeight: E.spacing.desktopKeylineIncrement * 5
  },
  medium: {
    minHeight: '50%'
  },
  full: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%'
  }
};
