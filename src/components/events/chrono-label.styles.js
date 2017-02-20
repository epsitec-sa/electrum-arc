'use strict';

/******************************************************************************/

export default function styles (theme, props) {

  const lineStyle = {
    minHeight:       theme.shapes.chronosLineHeight,
    maxHeight:       theme.shapes.chronosLineHeight,
    width:           theme.shapes.chronosLabelWidth,
    paddingLeft:     theme.shapes.chronosLabelMargin,
    borderRight:     theme.shapes.chronosSeparatorWidth + ' solid ' + theme.palette.chronoNavigatorBackground,
    display:         'flex',
    flexDirection:   'row',
    userSelect:      'none',
    cursor:          'default',
  };

  const glyphsStyle = {
    minHeight:       theme.shapes.chronosLineHeight,
    maxHeight:       theme.shapes.chronosLineHeight,
    width:           '60px',
    display:         'flex',
    flexDirection:   'row',
  };

  return {
    line:   lineStyle,
    glyphs: glyphsStyle,
  };
}

/******************************************************************************/
