'use strict';

/******************************************************************************/

// Move to absolute position.
function moveTo (result, x, y) {
  result += 'M ' + x + ' ' + y + ' ';
  return result;
}

// Line to relative position.
function lineTo (result, dx, dy) {
  result += 'l ' + dx + ' ' + dy + ' ';
  return result;
}

// Arc to relative position.
function arcTo (result, r, cx, cy) {
  // rx ry x-axis-rotation large-arc-flag sweep-flag x y
  result += 'a ' + r + ' '  + r + ' 0 0 0 ' + ' ' + cx + ' ' + cy + ' ';
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

  const r = 10;
  const w = width.replace (/px/g, '');
  const h = height.replace (/px/g, '');
  let path = '';
  path = moveTo (path, 0, r);
  path = arcTo (path, r, r, -r);
  path = lineTo (path, w - r - r, 0);
  path = arcTo (path, r, r, r);
  path = lineTo (path, 0, h - r - r);
  path = arcTo (path, r, -r, r);
  path = lineTo (path, -(w - r - r), 0);
  path = arcTo (path, r, -r, -r);

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
