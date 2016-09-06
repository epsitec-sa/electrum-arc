'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const inputKind   = props.kind;
  const inputHeight = props.height;

  let height            = '1px';
  let borderWidth       = '1px 0px 0px 0px';
  let borderStyle       = 'solid';
  let borderColor       = theme.palette.paneNavigatorInactiveBorder;
  let margin            = '0px';
  let padding           = '0px';
  let backgroundColor   = null;

  const s = theme.shapes.lineSpacing;

  let topMargin    = '0px';
  let bottomMargin = s;

  if (inputHeight) {
    const h = Unit.multiply (inputHeight, 0.5);
    topMargin    = Unit.add (topMargin,    h);
    bottomMargin = Unit.add (bottomMargin, h);
  }

  margin = topMargin + ' 0px ' + bottomMargin + ' 0px';

  if (inputKind === 'task') {
    height          = theme.shapes.taskSeparatorHeight;
    margin          = '0px';
    borderWidth     = '0px';
    borderStyle     = 'none';
    backgroundColor = theme.palette.taskSeparatorBackground;
  }

  if (inputKind === 'space') {
    borderWidth     = '0px';
    borderStyle     = 'none';
  }

  const boxStyle = {
    height:            height,
    borderWidth:       borderWidth,
    borderStyle:       borderStyle,
    borderColor:       borderColor,
    margin:            margin,
    padding:           padding,
    backgroundColor:   backgroundColor,
  };

  return {
    box: boxStyle,
  };
}

/******************************************************************************/
