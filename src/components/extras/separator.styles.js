'use strict';

/******************************************************************************/

export default function styles (theme, props) {
  const inputKind = props.kind;

  let height            = '1px';
  let borderWidth       = '1px 0px 0px 0px';
  let borderStyle       = 'solid';
  let borderColor       = theme.palette.paneNavigatorInactiveBorder;
  let margin            = '0px';
  let padding           = '0px';
  let backgroundColor   = null;

  const s = theme.shapes.lineSpacing;

  margin = '0px 0px ' + s + ' 0px';

  if (inputKind === 'task') {
    height          = theme.shapes.taskSeparatorHeight;
    margin          = '0px';
    borderWidth     = '0px';
    borderStyle     = 'none';
    backgroundColor = theme.palette.taskSeparatorBackground;
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
