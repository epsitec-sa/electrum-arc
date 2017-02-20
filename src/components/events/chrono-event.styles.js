'use strict';

/******************************************************************************/

export default function styles (theme, props) {

  const lineStyle = {
    width:           '100%',
    minHeight:       theme.shapes.chronosLineHeight,
    maxHeight:       theme.shapes.chronosLineHeight,
    userSelect:      'none',
    cursor:          'default',
  };

  return {
    line: lineStyle,
  };
}

/******************************************************************************/
