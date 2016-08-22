'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const inputWidth            = props.width;
  const inputTrianglePosition = props.trianglePosition;

  const t = Unit.add (theme.shapes.flyingBalloonTriangleSize, '0px', 0);  // round (suppress decimals)

  // This box is an invisible floating box that contains a component Container
  // with kind='flying-balloon'.
  let boxStyle = null;
  if (inputTrianglePosition === 'left') {
    boxStyle = {
      width:           inputWidth,
      display:         'flex',
      flexDirection:   'column',
      justifyContent:  'center',
      alignItems:      'center',
      position:        'absolute',
      left:            '100%',
      margin:          '0px 0px 0px ' + t,
      zIndex:          1,
    };
  } else if (inputTrianglePosition === 'right') {
    boxStyle = {
      width:           inputWidth,
      display:         'flex',
      flexDirection:   'column',
      justifyContent:  'center',
      alignItems:      'center',
      position:        'absolute',
      right:           '100%',
      margin:          '0px ' + t + ' 0px 0px',
      zIndex:          1,
    };
  } else if (inputTrianglePosition === 'bottom') {
    boxStyle = {
      width:           inputWidth,
      display:         'flex',
      flexDirection:   'column',
      justifyContent:  'center',
      alignItems:      'center',
      position:        'absolute',
      left:            '-1px',
      bottom:          '100%',
      margin:          '0px 0px ' + t + ' 0px',
      zIndex:          1,
    };
  } else {
    boxStyle = {
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
  }

  return {
    box: boxStyle,
  };
}

/******************************************************************************/
