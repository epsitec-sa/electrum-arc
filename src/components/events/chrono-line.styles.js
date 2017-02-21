'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const h = Unit.sub (theme.shapes.chronosLineHeight, '1px');

  const lineStyle = {
    position:        'relative',
    minHeight:       h,
    maxHeight:       h,
    width:           '100%',
    display:         'flex',
    flexDirection:   'row',
    userSelect:      'none',
    cursor:          'default',
    borderBottom:    '1px solid ' + theme.palette.chronoLineSeparator,
    backgroundColor: theme.palette.eventBackground,
    transition:      theme.transitions.easeOut (),
  };

  const lineHoverStyle = {
    position:        'relative',
    minHeight:       h,
    maxHeight:       h,
    width:           '100%',
    display:         'flex',
    flexDirection:   'row',
    userSelect:      'none',
    cursor:          'default',
    borderBottom:    '1px solid ' + theme.palette.chronoLineSeparator,
    backgroundColor: theme.palette.chronoHover,
    transition:      theme.transitions.easeOut (),
  };

  const lineLabelStyle = {
    minHeight:       theme.shapes.chronosLineHeight,
    maxHeight:       theme.shapes.chronosLineHeight,
    display:         'flex',
    flexDirection:   'row',
    userSelect:      'none',
    cursor:          'default',
  };

  const lineEventStyle = {
    position:        'relative',
    minHeight:       theme.shapes.chronosLineHeight,
    maxHeight:       theme.shapes.chronosLineHeight,
    flexGrow:        1,
    display:         'flex',
    flexDirection:   'row',
    justifyContent:  'center',
    userSelect:      'none',
    cursor:          'default',
  };

  return {
    line:       lineStyle,
    lineHover:  lineHoverStyle,
    lineLabel:  lineLabelStyle,
    lineEvent:  lineEventStyle,
  };
}

/******************************************************************************/
