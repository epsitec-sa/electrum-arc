'use strict';

/******************************************************************************/

export default function styles (theme, props) {
  const lineStyle = {
    position:        'relative',
    minHeight:       theme.shapes.chronosLineHeight,
    maxHeight:       theme.shapes.chronosLineHeight,
    display:         'flex',
    flexDirection:   'row',
    justifyContent:  'flex-start',
    userSelect:      'none',
    cursor:          'default',
  };

  return {
    line: lineStyle,
  };
}

/******************************************************************************/
