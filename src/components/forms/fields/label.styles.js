'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const inputGlyph   = props.glyph;
  const inputGrow    = props.grow;
  const inputKind    = props.kind;
  const inputWidth   = props.width;
  const inputSpacing = props.spacing;
  const inputWrap    = props.wrap;

  let boxWidth         = null;
  let textHeight       = null;
  let backgroundColor  = null;
  let padding          = null;
  let margin           = null;
  let display          = 'flex';
  let flexDirection    = 'row';
  let justifyContent   = 'flex-start';
  let alignItems       = 'center';
  let fontSize         = theme.shapes.labelTextSize;
  let fontWeight       = null;
  let textTransform    = null;
  let color            = theme.palette.text;
  let whiteSpace       = null;
  let overflow         = null;
  let textOverflow     = null;
  let linePaddingRight = null;

  const m = Unit.multiply (theme.shapes.containerMargin, 0.5);

  // Initialise right margin according to spacing.
  if (inputSpacing === 'overlap') {
    margin = '0px -1px 0px 0px';
  } else if (inputSpacing === 'tiny') {
    margin = '0px 1px 0px 0px';
  } else if (inputSpacing === 'large') {
    margin = '0px ' + m + ' 0px 0px';
  }

  if (inputWidth) {
    boxWidth = inputWidth;
  } else if (inputGrow && inputGrow.endsWith ('%')) {
    boxWidth = inputGrow;
  }

  if (inputKind === 'pane-header') {
    fontSize        = theme.shapes.paneHeaderTextSize;
    fontWeight      = 'bold';
    textTransform   = 'uppercase';
    color           = theme.palette.paneHeaderText;
  }

  if (inputKind === 'title') {
    fontSize        = theme.shapes.labelTitleTextSize;
    fontWeight      = 'bold';
    textTransform   = 'uppercase';
  }

  if (inputKind === 'info') {
    textHeight      = theme.shapes.lineHeight;
    backgroundColor = theme.palette.infoBackground;
    justifyContent  = 'center';
    padding         = '0 10px 0 10px';
  }

  if (inputKind === 'justify-left') {
    textHeight      = theme.shapes.lineHeight;
    justifyContent  = 'flex-start';
  }

  if (inputKind === 'justify-right') {
    textHeight      = theme.shapes.lineHeight;
    justifyContent  = 'flex-end';
  }

  if (inputKind === 'footer') {
    padding         = '0 20px 0 20px';
    color           = theme.palette.footerText;
  }

  if (inputWrap === 'no') {
    display      = null;
    whiteSpace   = 'nowrap';
    overflow     = 'hidden';
    textOverflow = 'ellipsis';
    if (inputGlyph) {
      linePaddingRight = theme.shapes.lineHeight;
    }
  }

  const boxStyle = {
    width:           boxWidth,
    padding:         padding,
    margin:          margin,
    display:         display,
    flexDirection:   flexDirection,
    justifyContent:  justifyContent,
    flexGrow:        inputGrow,
    backgroundColor: backgroundColor,
    whiteSpace:      whiteSpace,
    wordWrap:        'break-word',
  };

  const glyphStyle = {
    display:         'flex',
    flexDirection:   'row',
    alignItems:      'center',
    minWidth:        theme.shapes.lineHeight,
    height:          theme.shapes.lineHeight,
    padding:         '0px',
    color:           color,
  };

  const textStyle = {
    width:           '100%',
    height:          textHeight,
    display:         display,
    alignItems:      alignItems,
    justifyContent:  justifyContent,
    fontSize:        Unit.multiply (fontSize, theme.typo.fontScale),
    fontWeight:      fontWeight,
    textTransform:   textTransform,
    color:           color,
    overflow:     overflow,
    textOverflow: textOverflow,
    paddingRight: linePaddingRight,
  };

  const linesStyle = {
    width:           '100%',
    display:         'flex',
    flexDirection:   'column',
  };

  const lineStyle = {
    overflow:     overflow,
    textOverflow: textOverflow,
    paddingRight: linePaddingRight,
  };

  return {
    box:   boxStyle,
    glyph: glyphStyle,
    text:  textStyle,
    lines: linesStyle,
    line:  lineStyle,
  };
}

/******************************************************************************/
