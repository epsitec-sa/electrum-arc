'use strict';

import {Unit} from 'electrum-theme';
import {ColorHelpers} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const inputGrow          = props.grow;
  const inputKind          = props.kind;
  const inputJustify       = props.justify;
  const inputWidth         = props.width;
  const inputSpacing       = props.spacing;
  const inputWrap          = props.wrap;
  const inputVpos          = props.vpos;
  const inputGlyphColor    = props.glyphColor;
  const inputGlyphSize     = props.glyphSize;
  const inputTextColor     = props.textColor;
  const inputFontWeight    = props.fontWeight;
  const inputBottomSpacing = props.bottomSpacing;

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
  let glyphSize          = inputGlyphSize;
  let glyphColor         = theme.palette.text;
  let textColor          = theme.palette.text;
  let linesOverflow      = null;
  let textDisplay        = 'flex';
  let textAlign          = null;
  let textOverflow       = null;
  let textTextOverflow   = null;
  let textWhiteSpace     = null;
  let flexGrow           = inputGrow;
  let flexShrink         = null;
  let flexBasis          = null;

  const m = Unit.multiply (theme.shapes.containerMargin, 0.5);

  // Initialise bottom margin according to bottom-spacing.
  let bottomMargin = '0px';
  if (inputBottomSpacing === 'large') {
    bottomMargin = m;
  }
  // Initialise right margin according to spacing.
  if (inputSpacing === 'overlap') {
    margin = '0px -1px ' + bottomMargin + ' 0px';
  } else if (inputSpacing === 'tiny') {
    margin = '0px 1px ' + bottomMargin + ' 0px';
  } else if (inputSpacing === 'large') {
    margin = '0px ' + m + ' ' + bottomMargin + ' 0px';
  } else {
    margin = '0px 0px ' + bottomMargin + ' 0px';
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
    textAlign       = 'center';
  }

  if (inputKind === 'big-center') {
    fontSize          = theme.shapes.labelBigTextSize;
    fontWeight        = 'bold';
    textTransform     = 'uppercase';
    textAlign         = 'center';
    boxJustifyContent = 'center';
  }

  if (inputKind === 'info') {
    backgroundColor = theme.palette.infoBackground;
    boxJustifyContent = 'center';
    padding           = '0 10px 0 10px';
  }

  if (inputJustify === 'left') {
    boxJustifyContent = 'flex-start';
  }

  if (inputJustify === 'center') {
    boxJustifyContent = 'center';
  }

  if (inputJustify === 'right') {
    boxJustifyContent = 'flex-end';
  }

  if (inputKind === 'footer') {
    padding         = '0 20px 0 20px';
    glyphColor      = theme.palette.footerText;
    textColor       = theme.palette.footerText;
  }

  if (inputKind === 'flying-balloon') {
    glyphColor      = theme.palette.flyingBalloonText;
    textColor       = theme.palette.flyingBalloonText;
    fontSize        = theme.shapes.flyingBalloonTextSize;
  }

  if (inputKind === 'task') {
    padding         = theme.shapes.taskLabelTopMargin + ' 0px ' + theme.shapes.taskLabelBottomMargin + ' ' + theme.shapes.taskTabLeftMargin;
    glyphColor      = theme.palette.taskLabelText;
    textColor       = theme.palette.taskLabelText;
    fontWeight      = 'bold';
    fontSize        = theme.shapes.taskTabTextSize;
    glyphSize       = theme.shapes.taskTabGlyphSize;
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

  if (inputTextColor) {
    textColor = ColorHelpers.GetMarkColor (theme, inputTextColor);
  }

  if (flexGrow) {
    flexShrink = '1';
    flexBasis  = '0%';
  }

  if (inputFontWeight) {
    fontWeight = inputFontWeight;
  }

  let glyphTransform = null;
  if (glyphSize) {
    const s = Unit.parse (glyphSize);
    if (s.unit !== '%') {
      throw new Error (`GlyphSize '${glyphSize}' has an unexpected format`);
    }
    const ss = s.value / 100;
    glyphTransform = 'scale(' + ss + ')';
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
    transform:       glyphTransform,
  };

  const linesStyle = {
    width:           '100%',
    overflow:        linesOverflow,
  };

  const textStyle = {
    height:          textHeight,
    display:         textDisplay,
    flexDirection:   'column',
    alignSelf:       textAlign,
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
