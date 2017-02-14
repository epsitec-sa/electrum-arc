'use strict';

/******************************************************************************/

export default function styles (theme, props) {
  const lineStyle = {
    position:        'relative',
    minHeight:       theme.shapes.chronosLineHeight,
    maxHeight:       theme.shapes.chronosLineHeight,
    padding:         '0px 0px 0px 10px',
    display:         'flex',
    flexDirection:   'row',
    justifyContent:  'flex-start',
    userSelect:      'none',
    cursor:          'default',
  };

  const hoverLineStyle = {
    position:        'relative',
    minHeight:       theme.shapes.chronosLineHeight,
    maxHeight:       theme.shapes.chronosLineHeight,
    padding:         '0px 0px 0px 10px',
    display:         'flex',
    flexDirection:   'row',
    justifyContent:  'flex-start',
    userSelect:      'none',
    cursor:          'default',
    backgroundColor: theme.palette.chronoHover,
  };

  return {
    line:      lineStyle,
    hoverLine: hoverLineStyle,
  };
}

/******************************************************************************/
