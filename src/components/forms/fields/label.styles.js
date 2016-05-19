'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const inputGrow    = props.grow;
  const inputKind    = props.kind;
  const inputWidth   = props.width;
  const inputSpacing = props.spacing;

  let backgroundColor = null;
  let padding         = null;
  let margin          = null;
  let display         = 'flex';
  let flexDirection   = 'row';
  let justifyContent  = 'flex-start';
  let alignItems      = 'center';
  let fontSize        = theme.shapes.labelTextSize;
  let fontWeight      = null;
  let textTransform   = null;
  let color           = theme.palette.text;

  const m = Unit.multiply (theme.shapes.containerMargin, 0.5);

  // Initialise right margin according to spacing.
  if (inputSpacing === 'overlap') {
    margin = '0px -1px 0px 0px';
  } else if (inputSpacing === 'tiny') {
    margin = '0px 1px 0px 0px';
  } else if (inputSpacing === 'large') {
    margin = '0px ' + m + ' 0px 0px';
  }

  if (inputKind === 'info') {
    backgroundColor = theme.palette.infoBackground;
    justifyContent  = 'center';
    padding         = '0 10px 0 10px';
  }

  if (inputKind === 'title') {
    fontSize        = theme.shapes.labelTitleTextSize;
    fontWeight      = 'bold';
    textTransform   = 'uppercase';
  }

  if (inputKind === 'article') {
    justifyContent  = 'flex-start';
    padding         = '0 10px 0 10px';
  }

  if (inputKind === 'price') {
    justifyContent  = 'flex-end';
    padding         = '0 10px 0 10px';
  }

  if (inputKind === 'article-footer') {
    justifyContent  = 'flex-start';
    padding         = '0 10px 0 10px';
    backgroundColor = theme.palette.infoBackground;
  }

  if (inputKind === 'price-footer') {
    justifyContent  = 'flex-end';
    padding         = '0 10px 0 10px';
    backgroundColor = theme.palette.infoBackground;
  }

  if (inputKind === 'footer') {
    padding         = '0 20px 0 20px';
    color           = theme.palette.footerText;
  }

  const labelStyle = {
    width:           inputWidth,
    height:          theme.shapes.lineHeight,
    padding:         padding,
    margin:          margin,
    display:         display,
    flexDirection:   flexDirection,
    justifyContent:  justifyContent,
    alignItems:      alignItems,
    flexGrow:        inputGrow,
    fontSize:        Unit.multiply (fontSize, theme.typo.fontScale),
    fontWeight:      fontWeight,
    textTransform:   textTransform,
    color:           color,
    backgroundColor: backgroundColor,
  };

  return {
    label: labelStyle,
  };
}

/******************************************************************************/
