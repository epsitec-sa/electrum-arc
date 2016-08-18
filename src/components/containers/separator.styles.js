'use strict';

import {Unit} from 'electrum-theme';
import {ColorHelpers} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const inputKind = props.kind;

  let borderWidth       = '1px 0px 0px 0px';
  let borderStyle       = 'solid';
  let borderColor       = theme.palette.paneNavigatorInactiveBorder;
  let margin            = '0px';
  let padding           = '0px';

  const h = theme.shapes.lineHeight;
  const m = theme.shapes.containerMargin;
  const s = theme.shapes.lineSpacing;
  const d = Unit.multiply (m, 0.5);

  const boxStyle = {
    height:            '1px',
    borderWidth:       borderWidth,
    borderStyle:       borderStyle,
    borderColor:       borderColor,
    margin:            '0px 0px ' + s + ' 0px',
    padding:           padding,
  };

  return {
    box: boxStyle,
  };
}

/******************************************************************************/
