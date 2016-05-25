'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const inputLayer = props.layer;

  let boxPosition = null;
  let boxRight    = null;
  let boxTop      = null;

  // If badge has layer='over', place it on top-right corner of parent.
  if (inputLayer === 'over') {
    boxPosition = 'absolute';
    boxRight    = '0px';
    boxTop      = '0px';
  }

  const boxStyle = {
    width:           theme.shapes.lineHeight,
    height:          theme.shapes.lineHeight,
    display:         'flex',
    flexDirection:   'row',
    justifyContent:  'center',
    alignItems:      'center',
    position:        boxPosition,
    right:           boxRight,
    top:             boxTop,
  };

  const h = theme.shapes.badgeHeight;
  const r = theme.shapes.badgeRadius;
  const m = Unit.multiply (h, 0.25);
  const w = Unit.sub (h, Unit.multiply (m, 2.0));

  const labelStyle = {
    minWidth:        w,
    height:          h,
    borderRadius:    r,
    padding:         '0px ' + m + ' 1px ' + m,
    display:         'flex',
    flexDirection:   'row',
    justifyContent:  'center',
    alignItems:      'center',
    fontSize:        Unit.multiply (theme.shapes.badgeTextSize, theme.typo.fontScale),
    fontWeight:      'bold',
    color:           theme.palette.badgeText,
    backgroundColor: theme.palette.badgeBackground,
  };

  return {
    box:   boxStyle,
    label: labelStyle,
  };
}

/******************************************************************************/
