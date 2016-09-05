'use strict';

import {Unit} from 'electrum-theme';
import {ColorHelpers} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const inputWidth            = props.width;
  const inputHeight           = props.height;
  const inputKind             = props.kind;

  let width           = inputWidth;
  let height          = inputHeight;
  let padding         = theme.shapes.dialogPadding;
  let backgroundColor = theme.palette.dialogBackground;
  let boxShadow       = theme.shapes.dialogShadow;

  const boxStyle = {
    width:           width,
    height:          height,
    display:         'flex',
    flexDirection:   'row',
    backgroundColor: backgroundColor,
    boxShadow:       boxShadow,
    zIndex:          '2',
    position:        'absolute',
    left:            '0px',
    right:           '0px',
    top:             '0px',
    bottom:          '0px',
    margin:          'auto',
    // padding:         padding,
  };

  return {
    box: boxStyle,
  };
}

/******************************************************************************/
