'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  let   inputGrow    = props.grow;
  const inputSpacing = props.spacing;
  let   inputWidth   = props.width;

  const m = Unit.multiply (theme.shapes.containerMargin, 0.5);

  if (!inputGrow) {
    inputGrow = 1;
  }

  if (!inputWidth) {
    inputWidth = '10px';  // any non-zero width
  } else {
    inputGrow = null;  // if specific with exist, don't fill
  }

  // If component has specific width and border, reduce the width to
  // take into account the thickness of the borders left and right.
  if (inputWidth) {
    inputWidth = Unit.sub (inputWidth, '2px');
  }

  let boxStyle = {
    display:         'flex',
    flexDirection:   'row',
    justifyContent:  'flex-start',
    alignItems:      'center',
    flexGrow:        inputGrow,
    border:          '1px solid ' + theme.palette.buttonBorder,
    backgroundColor: theme.palette.buttonBackground,
    padding:         '0px',
    marginTop:       '0px',
    marginLeft:      '0px',
    marginBottom:    '0px',
    marginRight:     '0px',
  };

  const fieldStyle = {
    flexGrow:        1,
    width:           inputWidth,
    height:          theme.shapes.lineHeight,
    border:          'none',
    padding:         '10px',
    margin:          '0px',
  };

  if (inputSpacing === 'overlap') {
    boxStyle.marginRight = '-1px';
  } else if (inputSpacing === 'large') {
    boxStyle.marginRight = m;
  }

  return {
    box:   boxStyle,
    field: fieldStyle,
  };
}

/******************************************************************************/
