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

function getOutlinePath (theme, shape, width, height) {
  const r = toInt (theme.shapes.ticketCornerRadius);
  const s = toInt (theme.shapes.ticketLineRadius);
  const w = toInt (width);
  const h = toInt (height);

  let path = '';
  if (shape === 'header' || shape === 'last') {
    // Dash line only on bottom.
    path = moveTo (path, 0, 0);
    path = lineTo (path, w, 0);
    path = lineTo (path, 0, h - r);
    path = arcTo (path, r, -r, r, 0);  // bottom-right corner
    path = horizontalDash (path, -s, -s * 3.5, -(w - r - r));
    path = arcTo (path, r, -r, -r, 0);  // bottom-left corner
    path = close (path);
  } else if (shape === 'footer' || shape === 'first') {
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

function getHoverPath (theme, shape, type, width, height) {
  const r = toInt (theme.shapes.ticketCornerRadius);
  const t = toInt (theme.shapes.ticketHoverThickness);
  const i = toInt (Unit.multiply (Unit.multiply (theme.shapes.ticketCornerRadius, r), 1 / t));
  const w = toInt (width);
  const h = toInt (height);

  let path = '';
  if (type && type.startsWith ('drop')) {
    // u.
    const s = (shape === 'header' || shape === 'last') ? 0 : r;
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
  } else if (type && type.startsWith ('pick')) {
    // n.
    const s = (shape === 'footer' || shape === 'first') ? 0 : r;
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
  }
  return path;
}


export default function styles (theme, props) {
  const inputWidth  = props.width;
  const inputHeight = props.height;
  const inputKind   = props.kind;
  const inputShape  = props.shape;
  const inputType   = props.type;
  const inputColor  = props.color;
  const inputCursor = props.cursor;

  const r = (inputKind === 'thin') ? theme.shapes.ticketRectRadius : theme.shapes.ticketCornerRadius;
  let radius;
  if (inputType && inputType.startsWith ('pick')) {
    radius = r + ' ' + r + ' 0px 0px';
  } else if (inputType && inputType.startsWith ('drop')) {
    radius = '0px 0px ' + r + ' ' + r;
  } else {
    radius = r;
  }

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
  }

  const v = (inputShape === 'footer' || inputShape === 'first') ? '1px' : theme.shapes.ticketVerticalSpacing;
  const boxStyle = {
    width:      width,
    height:     height,
    margin:     '0px 0px ' + v + ' 0px',
    position:   'relative',
    cursor:     inputCursor,
    transition: theme.transitions.easeOut (),
    userSelect: 'none',

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

  const hatchStyle = {
    position:   'absolute',
    fill:       'url(#hatch)',
    transition: theme.transitions.easeOut (),
  };

  const svgStyle = {
    path: getOutlinePath (theme, inputShape, width, height),
  };

  const hoverStyle = {
    position:   'absolute',
    fill:       theme.palette.ticketHover,
    transition: theme.transitions.easeOut (),
    path:       getHoverPath (theme, inputShape, inputType, width, height),
  };

  const vp = (inputKind === 'thin') ? '0px' : theme.shapes.ticketVerticalPadding;
  const hp = (inputKind === 'thin') ? '0px' : theme.shapes.ticketHorizontalPadding;
  const contentStyle = {
    height:        inputHeight,
    position:      'relative',
    padding:       vp + ' ' + hp,
    display:       'flex',
    flexDirection: 'row',
    transition:    theme.transitions.easeOut (),
    userSelect:    'none',
  };

  const bm = (inputKind === 'thin') ? theme.shapes.tripBoxBottomMargin : '5px';
  const rectShadowStyle = {
    width:           inputWidth,
    margin:          `0px 0px ${bm} 0px`,
    position:        'relative',
    top:             theme.shapes.ticketShadowShift,
    cursor:          inputCursor,
    transition:      theme.transitions.easeOut (),
    borderRadius:    radius,
    backgroundColor: shadowColor,
  };

  const rectStyle = {
    position:        'relative',
    top:             '-' + theme.shapes.ticketShadowShift,
    cursor:          inputCursor,
    transition:      theme.transitions.easeOut (),
    borderRadius:    radius,
    backgroundColor: backgroundColor,
  };

  const hc = 'rgba(0,0,0,' + theme.palette.ticketHatchOpacity + ')';
  const hs = theme.shapes.ticketHatchSize;
  const ht = Unit.multiply (hs, 2);
  const rectContentHatchStyle = {
    position:      'relative',
    padding:       theme.shapes.ticketVerticalPadding + ' ' + theme.shapes.ticketHorizontalPadding,
    display:       'flex',
    flexDirection: 'row',
    transition:    theme.transitions.easeOut (),
    borderRadius:  radius,
    background:    `repeating-linear-gradient(-45deg, ${hc}, ${hc} ${hs}, rgba(0,0,0,0) 0px, rgba(0,0,0,0) ${ht})`,
  };

  const rectEmptyStyle = {
    position:     'absolute',
    width:        '100%',
    height:       '100%',
    top:          '0px',
    left:         '0px',
  };

  let rectHoverStyle;
  const t1 = theme.shapes.ticketHoverThickness;
  const t2 = Unit.multiply (theme.shapes.ticketHoverThickness, 2);
  if (inputType && inputType.startsWith ('drop')) {
    // u.
    rectHoverStyle = {
      position:        'absolute',
      width:           'calc(100% - ' + t2 + ')',
      height:          'calc(100% - ' + t1 + ')',
      top:             '1px',
      left:            '0px',
      borderRadius:    radius,
      borderWidth:     t1,
      borderStyle:     'none solid solid solid',
      borderColor:     theme.palette.ticketHover,
    };
  } else if (inputType && inputType.startsWith ('pick')) {
    // n.
    rectHoverStyle = {
      position:        'absolute',
      width:           'calc(100% - ' + t2 + ')',
      height:          'calc(100% - ' + t1 + ')',
      top:             '0px',
      left:            '0px',
      borderRadius:    radius,
      borderWidth:     t1,
      borderStyle:     'solid solid none solid',
      borderColor:     theme.palette.ticketHover,
    };
  } else {
    rectHoverStyle = {
      position:        'absolute',
      width:           'calc(100% - ' + t2 + ' + 1px)',
      height:          'calc(100% - ' + t2 + ' + 1px)',
      top:             '0px',
      left:            '0px',
      borderRadius:    radius,
      borderWidth:     t1,
      borderStyle:     'solid',
      borderColor:     theme.palette.ticketHover,
    };
  }

  const hudGlyphShadowStyle = {
    position:        'absolute',
    width:           '34px',
    height:          '34px',
    top:             '8px',
    right:           '7px',
    display:         'flex',
    justifyContent:  'center',
    alignItems:      'center',
    borderRadius:    '17px',
    boxShadow:       theme.shapes.ticketHudShadow,
    backgroundColor: theme.palette.ticketHudShadow,
    transform:       'scale(1)',
    transition:      theme.transitions.easeOut (),
  };

  const hudGlyphShadowNoneStyle = {
    position:        'absolute',
    width:           '34px',
    height:          '34px',
    top:             '8px',
    right:           '7px',
    display:         'flex',
    justifyContent:  'center',
    alignItems:      'center',
    borderRadius:    '17px',
    boxShadow:       theme.shapes.ticketHudShadow,
    backgroundColor: theme.palette.ticketHudShadow,
    transform:       'scale(0)',
    transition:      theme.transitions.easeOut (),
  };

  const hudGlyphBoxStyle = {
    position:        'absolute',
    width:           '30px',
    height:          '30px',
    top:             '-1px',
    right:           '0px',
    display:         'flex',
    justifyContent:  'center',
    alignItems:      'center',
    border:          '1px solid',
    borderRadius:    '15px',
    backgroundColor: theme.palette.ticketHudBackground,
    transition:      'all 0.5s',
  };

  const hudGlyphBoxNoneStyle = {
    position:        'absolute',
    width:           '30px',
    height:          '30px',
    top:             '-1px',
    right:           '0px',
    display:         'flex',
    justifyContent:  'center',
    alignItems:      'center',
    border:          '1px solid',
    borderRadius:    '15px',
    backgroundColor: theme.palette.ticketHudContent,
    transition:      'all 0.1s',
  };

  const hudGlyphStyleContent = {
    transform:       'scale(1.2)',
    color:           theme.palette.ticketHudContent,
  };

  return {
    box:                boxStyle,
    shadow:             shadowStyle,
    shape:              shapeStyle,
    hatch:              hatchStyle,
    svg:                svgStyle,
    hover:              hoverStyle,
    content:            contentStyle,
    rectShadow:         rectShadowStyle,
    rect:               rectStyle,
    rectContentHatch:   rectContentHatchStyle,
    rectEmpty:          rectEmptyStyle,
    rectHover:          rectHoverStyle,
    hudGlyphShadow:     hudGlyphShadowStyle,
    hudGlyphShadowNone: hudGlyphShadowNoneStyle,
    hudGlyphBox:        hudGlyphBoxStyle,
    hudGlyphBoxNone:    hudGlyphBoxNoneStyle,
    hudGlyphContent:    hudGlyphStyleContent,
  };
}

/******************************************************************************/
