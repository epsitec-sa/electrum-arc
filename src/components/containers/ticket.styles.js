'use strict';

/******************************************************************************/

function moveTo (result, x, y) {
  result += 'M ' + x + ' ' + y + ' ';
  return result;
}

function lineTo (result, x, y) {
  result += 'L ' + x + ' ' + y + ' ';
  return result;
}


export default function styles (theme, props) {
  const inputWidth  = props.width;
  const inputHeight = props.height;
  const inputKind   = props.kind;

  let width           = inputWidth;
  let height          = inputHeight;
  let backgroundColor = null;

  const s = theme.shapes.lineSpacing;

  if (inputKind === 'header') {
    backgroundColor = theme.palette.ticketHeaderBackground;
  } else {
    backgroundColor = theme.palette.ticketBackground;
  }

  const boxStyle = {
    width:           width,
    height:          height,
    margin:          '0px 0px ' + s + ' 0px',
    position:        'relative',
  };

  const shapeStyle = {
    position:        'absolute',
  };

  let path = '';
  path = moveTo (path, 0, 0);
  path = lineTo (path, 300, 0);
  path = lineTo (path, 0, 100);

  const svgStyle = {
    backgroundColor: backgroundColor,
    path:            path,
  };

  const contentStyle = {
    position:        'relative',
    padding:         s,
  };

  return {
    box:     boxStyle,
    shape:   shapeStyle,
    svg:     svgStyle,
    content: contentStyle,
  };
}

/******************************************************************************/
