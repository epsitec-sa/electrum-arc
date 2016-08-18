'use strict';

/******************************************************************************/

export default function styles (theme, props) {
  const inputKind = props.kind;

  let borderWidth       = '1px 0px 0px 0px';
  let borderStyle       = 'solid';
  let borderColor       = theme.palette.paneNavigatorInactiveBorder;
  let margin            = '0px';
  let padding           = '0px';

  const s = theme.shapes.lineSpacing;

  margin = '0px 0px ' + s + ' 0px';

  const boxStyle = {
    height:            '1px',
    borderWidth:       borderWidth,
    borderStyle:       borderStyle,
    borderColor:       borderColor,
    margin:            margin,
    padding:           padding,
  };

  return {
    box: boxStyle,
  };
}

/******************************************************************************/
