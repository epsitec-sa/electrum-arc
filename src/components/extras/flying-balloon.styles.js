'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const inputWidth = props.width;

  const t = Unit.add (theme.shapes.flyingBalloonTriangleSize, '0px', 0);  // round (suppress decimals)

  // This box is an invisible floating box that contains a component Container
  // with kind='flying-balloon'.
  const boxStyle = {
    width:           inputWidth,
    display:         'flex',
    flexDirection:   'column',
    justifyContent:  'center',
    alignItems:      'center',
    position:        'absolute',
    left:            '-1px',
    top:             '100%',
    margin:          t + ' 0px 0px 0px',
    zIndex:          1,
  };

  return {
    box: boxStyle,
  };
}

/******************************************************************************/
