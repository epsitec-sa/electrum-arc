'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  let   inputGrow       = props.grow;
  const inputSpacing    = props.spacing;

  const m = Unit.multiply (theme.shapes.containerMargin, 0.5);

  if (!inputGrow) {
    inputGrow = 1;
  }

  let boxStyle = {
    display:        'flex',
    flexDirection:  'row',
    justifyContent: 'flex-start',
    alignItems:     'center',
    flexGrow:       inputGrow,
    padding:        '0px',
    marginTop:      '0px',
    marginLeft:     '0px',
    marginBottom:   '0px',
    marginRight:    '0px',
  };

  if (inputSpacing === 'overlap') {
    boxStyle.marginRight = '-1px';
  } else if (inputSpacing === 'large') {
    boxStyle.marginRight = m;
  }

  return {
    box: boxStyle,
  };
}

/******************************************************************************/
