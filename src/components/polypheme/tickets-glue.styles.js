'use strict';

/******************************************************************************/

export default function styles (theme, props) {
  const inputWidth   = props.width;
  const inputHeight  = props.height;
  const inputLeft    = props.left;
  const inputRight   = props.right;
  const inputTop     = props.top;
  const inputBottom  = props.bottom;
  const inputRotate  = props.rotate;

  const boxStyle = {
    position:        'absolute',
    left:            inputLeft,
    right:           inputRight,
    top:             inputTop,
    bottom:          inputBottom,
    transform:       inputRotate ? 'rotate(' + inputRotate + ')' : null,
    minWidth:        inputWidth  ? inputWidth  : '220px',
    minHeight:       inputHeight ? inputHeight : '164px',
    backgroundColor: theme.palette.ticketGlueBackground,
    boxShadow:       theme.shapes.ticketGlueShadow,
  };

  return {
    box:      boxStyle,
  };
}

/******************************************************************************/
