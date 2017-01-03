'use strict';

/******************************************************************************/

export default function styles (theme, props) {
  const inputWidth  = props.width;
  const inputHeight = props.height;

  let width  = inputWidth;
  let height = inputHeight;

  const boxStyle = {
    width:           width,
    height:          height,
    minHeight:       theme.shapes.footerHeight,
    display:         'flex',
    flexDirection:   'row',
    flexGrow:        0,
    justifyContent:  'flex-start',
    alignItems:      'center',
    backgroundColor: theme.palette.footerBackground,
  };

  return {
    box: boxStyle,
  };
}

/******************************************************************************/
