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

  let boxWidth           = null;
  let textHeight         = null;
  let backgroundColor    = null;
  let padding            = null;
  let margin             = null;
  let textAlignItems     = null;
  let fontSize           = theme.shapes.labelTextSize;
  let fontWeight         = null;
  let textTransform      = null;
  let color              = theme.palette.text;
  let linesOverflow      = null;
  let textDisplay        = 'flex';
  let textOverflow       = null;
  let textTextOverflow   = null;
  let textWhiteSpace     = null;

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
    // textHeight      = theme.shapes.lineHeight;
    backgroundColor = theme.palette.infoBackground;
    textAlignItems  = 'center';
    padding         = '0 10px 0 10px';
  }

  if (inputKind === 'justify-left') {
    // textHeight      = theme.shapes.lineHeight;
    textAlignItems = 'flex-start';
  }

  if (inputKind === 'justify-right') {
    // textHeight      = theme.shapes.lineHeight;
    textAlignItems = 'flex-end';
  }

  if (inputKind === 'footer') {
    padding         = '0 20px 0 20px';
    color           = theme.palette.footerText;
  }

  if (inputWrap === 'no') {
    textDisplay      = null;
    linesOverflow    = 'hidden';
    textOverflow     = 'hidden';
    textTextOverflow = 'ellipsis';
    textWhiteSpace   = 'nowrap';
  }

  const boxStyle = {
    width:           boxWidth,
    padding:         padding,
    margin:          margin,
    display:         'flex',
    flexDirection:   'row',
    justifyContent:  'flex-start',
    flexGrow:        inputGrow,
    backgroundColor: backgroundColor,
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

  const linesStyle = {
    width:           '100%',
    overflow:        linesOverflow,
  };

  const textStyle = {
    width:           '100%',
    height:          textHeight,
    display:         textDisplay,
    flexDirection:   'column',
    alignItems:      textAlignItems,
    fontSize:        Unit.multiply (fontSize, theme.typo.fontScale),
    fontWeight:      fontWeight,
    textTransform:   textTransform,
    color:           color,
    overflow:        textOverflow,
    textOverflow:    textTextOverflow,
    whiteSpace:      textWhiteSpace,
    wordWrap:        'break-word',
  };

  return {
    box:   boxStyle,
    glyph: glyphStyle,
    lines: linesStyle,
    text:  textStyle,
  };
}

/******************************************************************************/
