'use strict';

/******************************************************************************/

// Convert string '123px' to int 123.
function toInt (value) {
  if (typeof value === 'string') {
    return parseInt (value.replace (/px/g, ''));
  } else {
    return value;
  }
}

// Move to absolute position.
function moveTo (path, x, y) {
  path += 'M ' + x + ' ' + y + ' ';
  return path;
}

// Line to relative position.
function lineTo (path, dx, dy) {
  path += 'l ' + dx + ' ' + dy + ' ';
  return path;
}

// Arc to relative position.
function arcTo (path, r, cx, cy) {
  // rx ry x-axis-rotation large-arc-flag sweep-flag x y
  // see http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
  path += 'a ' + r + ' '  + r + ' 0 0 0 ' + ' ' + cx + ' ' + cy + ' ';
  return path;
}

// Draw _n_n_n_n_n_n_n_n_n_n_n_n_n_
function horizontalDash (path, r, len, dx) {
  const step = parseInt (dx / len);
  const over = (dx - (len * step)) / 2;
  path = lineTo (path, over + r, 0);
  let i = 0;
  for (i = 0; i < step - 1; i++) {
    path = lineTo (path, len - r - r, 0);
    path = arcTo (path, r, r + r, 0);
  }
  path = lineTo (path, len - r + over, 0);
  return path;
}


export default function styles (theme, props) {
  const inputWidth  = props.width;
  const inputHeight = props.height;
  const inputKind   = props.kind;

  let width           = inputWidth;
  let height          = inputHeight;
  let backgroundColor = null;

  if (inputKind === 'header') {
    backgroundColor = theme.palette.ticketHeaderBackground;
  } else {
    backgroundColor = theme.palette.ticketBackground;
  }

  const boxStyle = {
    width:    width,
    height:   height,
    margin:   '0px 0px ' + theme.shapes.ticketVerticalSpacing + ' 0px',
    position: 'relative',
  };

  const shapeStyle = {
    position: 'absolute',
  };

  const r = toInt (theme.shapes.ticketCornerRadius);
  const s = toInt (theme.shapes.ticketLineRadius);
  const w = toInt (width);
  const h = toInt (height);

  let path = '';
  path = moveTo (path, 0, r);
  path = arcTo (path, r, r, -r);
  path = horizontalDash (path, s, s * 3, w - r - r);
  path = arcTo (path, r, r, r);
  path = lineTo (path, 0, h - r - r);
  path = arcTo (path, r, -r, r);
  path = horizontalDash (path, -s, -s * 3, -(w - r - r));
  path = arcTo (path, r, -r, -r);

  const svgStyle = {
    backgroundColor: backgroundColor,
    path:            path,
  };

  const contentStyle = {
    position: 'relative',
    padding:  theme.shapes.ticketPadding,
  };

  return {
    box:     boxStyle,
    shape:   shapeStyle,
    svg:     svgStyle,
    content: contentStyle,
  };
}

/******************************************************************************/
