'use strict';

/******************************************************************************/

export default function styles (theme, props) {
  const inputWidth = props.width;

  let minWidth        = null;
  let backgroundColor = null;

  if (inputWidth) {
    minWidth = inputWidth;
  }

  backgroundColor = theme.palette.menuBackground;

  const boxStyle = {
    minWidth:        minWidth,
    backgroundColor: backgroundColor,
  };

  return {
    box: boxStyle,
  };
}

/******************************************************************************/
