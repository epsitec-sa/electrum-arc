'use strict';

/******************************************************************************/

export default function styles (theme, props) {
  const inputLeft   = props.left;
  const inputRight  = props.right;
  const inputTop    = props.top;
  const inputBottom = props.bottom;
  const inputRotate = props.rotate;

  const boxStyle = {
    position:        'absolute',
    left:            inputLeft,
    right:           inputRight,
    top:             inputTop,
    bottom:          inputBottom,
    transform:       inputRotate ? 'rotate(' + inputRotate + ')' : null,
    backgroundColor: theme.palette.ticketGlueBackground,
    boxShadow:       theme.shapes.ticketGlueShadow,
  };

  const titleStyle = {
    display:         'flex',
    minHeight:       '30px',
    maxHeight:       '30px',
    margin:          '0px 10px',
    cursor:          'pointer',
  };

  return {
    box:   boxStyle,
    title: titleStyle,
  };
}

/******************************************************************************/
