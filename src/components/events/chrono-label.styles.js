'use strict';

/******************************************************************************/

export default function styles (theme, props) {
  const lineStyle = {
    position:        'absolute',
    minHeight:       theme.shapes.chronosLineHeight,
    maxHeight:       theme.shapes.chronosLineHeight,
    width:           '100%',
    padding:         '0px 0px 0px 10px',
    display:         'flex',
    flexDirection:   'row',
    justifyContent:  'flex-start',
    userSelect:      'none',
    cursor:          'default',
    backgroundColor: theme.palette.eventBackground,
  };

  const hoverLineStyle = {
    position:        'absolute',
    minHeight:       theme.shapes.chronosLineHeight,
    maxHeight:       theme.shapes.chronosLineHeight,
    width:           '100%',
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
