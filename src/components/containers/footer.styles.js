'use strict';

/******************************************************************************/

export default function styles (theme, props) {
  const inputWidth  = props.width;
  const inputHeight = props.height;

  const boxStyle = {
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
