'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const h = Unit.sub (theme.shapes.chronosLineHeight, '1px');

  const lineStyle = {
    position:        'absolute',
    width:           '100%',
    minHeight:       h,
    maxHeight:       h,
    userSelect:      'none',
    cursor:          'default',
    backgroundColor: theme.palette.eventBackground,
    borderBottom:    '1px solid ' + theme.palette.chronoLineSeparator,
  };

  const lineHoverStyle = {
    position:        'absolute',
    width:           '100%',
    minHeight:       h,
    maxHeight:       h,
    userSelect:      'none',
    cursor:          'default',
    backgroundColor: theme.palette.chronoHover,
    borderBottom:    '1px solid ' + theme.palette.chronoLineSeparator,
  };

  return {
    line:      lineStyle,
    lineHover: lineHoverStyle,
  };
}

/******************************************************************************/
