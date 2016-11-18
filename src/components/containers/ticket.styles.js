'use strict';

import {Unit} from 'electrum-theme';

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
function arcTo (path, r, cx, cy, sweepFlag) {
  // rx ry x-axis-rotation large-arc-flag sweep-flag x y
  // see http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
  path += 'a ' + r + ' '  + r + ' 0 0 ' + sweepFlag + ' ' + cx + ' ' + cy + ' ';
  // path += 'a ' + r + ' '  + r + ' 0 0 0 ' + cx + ' ' + cy + ' ';
  return path;
}

// Close path.
function close (path) {
  path += 'z';
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
    path = arcTo (path, r, r + r, 0, 0);
  }
  path = lineTo (path, len - r + over, 0);
  return path;
}

function getOutlinePath (theme, kind, width, height) {
  const r = toInt (theme.shapes.ticketCornerRadius);
  const s = toInt (theme.shapes.ticketLineRadius);
  const w = toInt (width);
  const h = toInt (height);

  let path = '';
  if (kind === 'header') {
    // Dash line only on bottom.
    path = moveTo (path, 0, 0);
    path = lineTo (path, w, 0);
    path = lineTo (path, 0, h - r);
    path = arcTo (path, r, -r, r, 0);  // bottom-right corner
    path = horizontalDash (path, -s, -s * 3.5, -(w - r - r));
    path = arcTo (path, r, -r, -r, 0);  // bottom-left corner
    path = close (path);
  } else if (kind === 'footer') {
    // Dash line only on top.
    path = moveTo (path, 0, r);
    path = arcTo (path, r, r, -r, 0);  // top-left corner
    path = horizontalDash (path, s, s * 3.5, w - r - r);
    path = arcTo (path, r, r, r, 0);  // top-right corner
    path = lineTo (path, 0, h - r);
    path = lineTo (path, -w, 0);
    path = close (path);
  } else {
    // Dash line on top and bottom.
    path = moveTo (path, 0, r);
    path = arcTo (path, r, r, -r, 0);  // top-left corner
    path = horizontalDash (path, s, s * 3.5, w - r - r);
    path = arcTo (path, r, r, r, 0);  // top-right corner
    path = lineTo (path, 0, h - r - r);
    path = arcTo (path, r, -r, r, 0);  // bottom-right corner
    path = horizontalDash (path, -s, -s * 3.5, -(w - r - r));
    path = arcTo (path, r, -r, -r, 0);  // bottom-left corner
    path = close (path);
  }
  return path;
}

function getHoverPath (theme, kind, subkind, width, height) {
  const r = toInt (theme.shapes.ticketCornerRadius);
  const t = toInt (theme.shapes.ticketHoverThickness);
  const i = toInt (Unit.multiply (Unit.multiply (theme.shapes.ticketCornerRadius, r), 1 / t));
  const s = (kind === 'header' || kind === 'footer') ? 0 : r;
  const w = toInt (width);
  const h = toInt (height);

  let path = '';
  if (subkind === 'drop') {
    // u.
    path = moveTo (path, 0, s);
    path = lineTo (path, 0, h - s - r);
    path = arcTo (path, r, r, r, 1);  // bottom-left external corner
    path = lineTo (path, w - r - r, 0);
    path = arcTo (path, r, r, -r, 1); // bottom-right external corner
    path = lineTo (path, 0, -(h - s - r));
    path = lineTo (path, -t, 0);
    path = lineTo (path, 0, h - t - s - r);
    path = arcTo (path, i, -r, r, 0);  // bottom-right internal corner
    path = lineTo (path, -(w - r - r - t - t), 0);
    path = arcTo (path, i, -r, -r, 0);  // bottom-left internal corner
    path = lineTo (path, 0, -(h - t - s - r));
    path = close (path);
  } else if (subkind === 'pick') {
    // n.
    path = moveTo (path, 0, h - s);
    path = lineTo (path, 0, -(h - s - r));
    path = arcTo (path, r, r, -r, 0);  // bottom-left external corner
    path = lineTo (path, w - r - r, 0);
    path = arcTo (path, r, r, r, 0); // bottom-right external corner
    path = lineTo (path, 0, h - s - r);
    path = lineTo (path, -t, 0);
    path = lineTo (path, 0, -(h - t - s - r));
    path = arcTo (path, i, -r, -r, 1);  // bottom-right internal corner
    path = lineTo (path, -(w - r - r - t - t), 0);
    path = arcTo (path, i, -r, r, 1);  // bottom-left internal corner
    path = lineTo (path, 0, h - t - s - r);
    path = close (path);
  } else {
    // throw new Error (`Fatal error in Ticket component subkind=${subkind}`);
  }
  return path;
}


export default function styles (theme, props) {
  const inputWidth    = props.width;
  const inputHeight   = props.height;
  const inputKind     = props.kind;
  const inputSubkind  = props.subkind;
  const inputSelected = props.selected;
  const inputColor    = props.color;
  const inputCursor   = props.cursor;
  const inputExtended = props.extended;

  let width           = inputWidth;
  let height          = inputHeight;
  let backgroundColor = theme.palette.ticketBackground;
  let shadowColor     = theme.palette.ticketShadow;

  if (inputColor) {
    backgroundColor = {
      selected: theme.palette.ticketSelectedBackground,
      blue:     theme.palette.ticketBlueBackground,
      yellow:   theme.palette.ticketYellowBackground,
      red:      theme.palette.ticketRedBackground,
      green:    theme.palette.ticketGreenBackground,
    } [inputColor];
  } else if (inputSelected === 'true') {
    backgroundColor = theme.palette.ticketSelectedBackground;
  }

  const v = (inputKind === 'footer') ? '1px' : theme.shapes.ticketVerticalSpacing;
  const boxStyle = {
    width:      width,
    height:     height,
    margin:     '0px 0px ' + v + ' 0px',
    position:   'relative',
    cursor:     inputCursor,
    transition: theme.transitions.easeOut (),
  };

  const shadowStyle = {
    position: 'absolute',
    top:      theme.shapes.ticketShadowShift,
    fill:     shadowColor,
  };

  const shapeStyle = {
    position:   'absolute',
    fill:       backgroundColor,
    transition: theme.transitions.easeOut (),
  };
  // TODO: Why does not work ???
  // shapeStyle[':hover'] = {
  //   fill: '#f00',
  // };

  const hatchStyle = {
    position:   'absolute',
    fill:       'url(#hatch)',
    transition: theme.transitions.easeOut (),
  };

  const svgStyle = {
    path: getOutlinePath (theme, inputKind, width, height),
  };

  const hoverStyle = {
    position:   'absolute',
    fill:       theme.palette.ticketShadowHover,
    transition: theme.transitions.easeOut (),
    path:       getHoverPath (theme, inputKind, inputSubkind, width, height),
  };

  const contentStyle = {
    position:      'relative',
    padding:       theme.shapes.ticketVerticalPadding + ' ' + theme.shapes.ticketHorizontalPadding,
    display:       'flex',
    flexDirection: 'row',
    transition:    theme.transitions.easeOut (),
  };

  // Invisible zone for drag & drop detection.
  const dragZoneStyle = {
    position:     'absolute',
    width:        '100%',
    height:       '100%',
    top:          '0px',
    left:         '0px',
    zIndex:       '10',
  };

  const rectStyle = {
    margin:          '2px 0px 4px 0px',
    position:        'relative',
    cursor:          inputCursor,
    transition:      theme.transitions.easeOut (),
    backgroundColor: backgroundColor,
    borderRadius:    theme.shapes.ticketCornerRadius,
  };

  const rectHoverStyle = {
    position:        'absolute',
    width:           'calc(100% - 10px)',
    height:          'calc(100% - 10px)',
    top:             '0px',
    left:            '0px',
    borderRadius:    theme.shapes.ticketCornerRadius,
    border:          theme.shapes.ticketHoverThickness + ' solid ' + theme.palette.ticketShadowHover,
    zIndex:          '10',
  };

  return {
    box:           boxStyle,
    shadow:        shadowStyle,
    shape:         shapeStyle,
    hatch:         hatchStyle,
    svg:           svgStyle,
    hover:         hoverStyle,
    content:       contentStyle,
    dragZoneStyle: dragZoneStyle,
    rect:          rectStyle,
    rectHover:     rectHoverStyle,
  };
}

/******************************************************************************/
