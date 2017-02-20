'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const lineWidth  = props.lineWidth;
  const glyphWidth = props.glyphWidth;

  const lineStyle = {
    minHeight:       theme.shapes.chronosLineHeight,
    maxHeight:       theme.shapes.chronosLineHeight,
    width:           Unit.sub (lineWidth, theme.shapes.chronosLabelMargin),
    paddingLeft:     theme.shapes.chronosLabelMargin,
    borderRight:     theme.shapes.chronosSeparatorWidth + ' solid ' + theme.palette.chronoLabelSeparator,
    display:         'flex',
    flexDirection:   'row',
    userSelect:      'none',
    cursor:          'default',
  };

  const glyphsStyle = {
    minHeight:       theme.shapes.chronosLineHeight,
    maxHeight:       theme.shapes.chronosLineHeight,
    width:           glyphWidth,
    display:         'flex',
    flexDirection:   'row',
  };

  return {
    line:   lineStyle,
    glyphs: glyphsStyle,
  };
}

/******************************************************************************/
