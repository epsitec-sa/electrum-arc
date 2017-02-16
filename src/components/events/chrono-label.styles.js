'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const h = Unit.sub (theme.shapes.chronosLineHeight, '1px');

  const lineStyle = {
    width:           '100%',
    minHeight:       h,
    maxHeight:       h,
    display:         'flex',
    flexDirection:   'row',
    userSelect:      'none',
    cursor:          'default',
    backgroundColor: theme.palette.eventBackground,
    borderBottom:    '1px solid ' + theme.palette.chronoLineSeparator,
  };

  const lineHoverStyle = {
    width:           '100%',
    minHeight:       h,
    maxHeight:       h,
    display:         'flex',
    flexDirection:   'row',
    userSelect:      'none',
    cursor:          'default',
    backgroundColor: theme.palette.chronoHover,
    borderBottom:    '1px solid ' + theme.palette.chronoLineSeparator,
  };

  const glyphsStyle = {
    width:           '60px',
    display:         'flex',
    flexDirection:   'row',
  };

  return {
    line:      lineStyle,
    lineHover: lineHoverStyle,
    glyphs:    glyphsStyle,
  };
}

/******************************************************************************/
