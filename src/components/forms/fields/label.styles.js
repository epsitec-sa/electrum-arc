'use strict';

import {Unit} from 'electrum-theme';
import {ColorHelpers} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const inputGrow       = props.grow;
  const inputKind       = props.kind;
  const inputWidth      = props.width;
  const inputSpacing    = props.spacing;
  const inputWrap       = props.wrap;
  const inputVpos       = props.vpos;
  const inputGlyphColor = props.glyphColor;

  let boxWidth           = null;
  let textHeight         = null;
  let backgroundColor    = null;
  let padding            = null;
  let margin             = null;
  let fontSize           = theme.shapes.labelTextSize;
  let fontWeight         = null;
  let boxJustifyContent  = null;
  let boxAlignSelf       = null;
  let textTransform      = null;
  let glyphColor         = theme.palette.text;
  let textColor          = theme.palette.text;
  let linesOverflow      = null;
  let textDisplay        = 'flex';
  let textOverflow       = null;
  let textTextOverflow   = null;
  let textWhiteSpace     = null;
  let flexGrow           = inputGrow;
  let flexShrink         = null;
  let flexBasis          = null;

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
    glyphColor      = theme.palette.paneHeaderText;
    textColor       = theme.palette.paneHeaderText;
  }

  if (inputKind === 'title') {
    fontSize        = theme.shapes.labelTitleTextSize;
    fontWeight      = 'bold';
    textTransform   = 'uppercase';
  }

  if (inputKind === 'info') {
    backgroundColor = theme.palette.infoBackground;
    boxJustifyContent = 'center';
    padding           = '0 10px 0 10px';
  }

  if (inputKind === 'justify-left') {
    boxJustifyContent = 'flex-start';
  }

  if (inputKind === 'justify-right') {
    boxJustifyContent = 'flex-end';
  }

  if (inputKind === 'footer') {
    padding         = '0 20px 0 20px';
    glyphColor      = theme.palette.footerText;
    textColor       = theme.palette.footerText;
  }

  if (inputVpos === 'top') {
    boxAlignSelf = 'flex-start';
  }

  if (inputWrap === 'no') {
    textDisplay      = null;
    linesOverflow    = 'hidden';
    textOverflow     = 'hidden';
    textTextOverflow = 'ellipsis';
    textWhiteSpace   = 'nowrap';
  }

  if (inputGlyphColor) {
    glyphColor = ColorHelpers.GetMarkColor (theme, inputGlyphColor);
  }

  if (flexGrow) {
    flexShrink = '1';
    flexBasis  = '0%';
  }

  const boxStyle = {
    width:           boxWidth,
    minWidth:        '0px',
    padding:         padding,
    margin:          margin,
    display:         'flex',
    flexDirection:   'row',
    justifyContent:  boxJustifyContent,
    alignSelf:       boxAlignSelf,
    flexGrow:        flexGrow,
    flexShrink:      flexShrink,
    flexBasis:       flexBasis,
    backgroundColor: backgroundColor,
  };

  const glyphStyle = {
    display:         'flex',
    flexDirection:   'row',
    alignItems:      'center',
    minWidth:        theme.shapes.lineHeight,
    height:          theme.shapes.lineHeight,
    padding:         '0px',
    color:           glyphColor,
  };

  const linesStyle = {
    width:           '100%',
    overflow:        linesOverflow,
  };

  const textStyle = {
    height:          textHeight,
    display:         textDisplay,
    flexDirection:   'column',
    fontSize:        Unit.multiply (fontSize, theme.typo.fontScale),
    fontWeight:      fontWeight,
    textTransform:   textTransform,
    color:           textColor,
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
