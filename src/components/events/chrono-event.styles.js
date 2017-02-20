'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const h = Unit.sub (theme.shapes.chronosLineHeight, '1px');

  const lineStyle = {
    width:           '100%',
    minHeight:       h,
    maxHeight:       h,
    userSelect:      'none',
    cursor:          'default',
    borderBottom:    '1px solid ' + theme.palette.chronoLineSeparator,
  };

  return {
    line: lineStyle,
  };
}

/******************************************************************************/
