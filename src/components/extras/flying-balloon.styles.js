'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const inputWidth            = props.width;
  const inputMaxWidth         = props.maxWidth;
  const inputTrianglePosition = props.trianglePosition;

  const t = Unit.add (theme.shapes.flyingBalloonTriangleSize, '0px', 0);  // round (suppress decimals)

  // This box is an invisible floating box that contains a component Container
  // with kind='flying-balloon'. For example, if triangle-position='left', the
  // floating box is positioned to the right the parent box.
  let boxStyle = null;
  if (inputTrianglePosition === 'left') {
    boxStyle = {
      width:           inputWidth ? inputWidth : '100%',
      maxWidth:        inputMaxWidth ? inputMaxWidth : '200px',
      display:         'flex',
      flexDirection:   'column',
      justifyContent:  'flex-start',
      alignItems:      'flex-start',
      position:        'absolute',
      left:            '100%',
      margin:          '0px 0px 0px ' + t,
      zIndex:          1,
    };
  } else if (inputTrianglePosition === 'right') {
    boxStyle = {
      width:           inputWidth ? inputWidth : '100%',
      maxWidth:        inputMaxWidth ? inputMaxWidth : '200px',
      display:         'flex',
      flexDirection:   'column',
      justifyContent:  'flex-start',
      alignItems:      'flex-start',
      position:        'absolute',
      right:           '100%',
      margin:          '0px ' + t + ' 0px 0px',
      zIndex:          1,
    };
  } else if (inputTrianglePosition === 'bottom') {
    boxStyle = {
      width:           inputWidth ? inputWidth : '100%',
      maxWidth:        inputMaxWidth ? inputMaxWidth : '200px',
      display:         'flex',
      flexDirection:   'column',
      justifyContent:  'flex-start',
      alignItems:      'flex-start',
      position:        'absolute',
      left:            '-1px',
      bottom:          '100%',
      margin:          '0px 0px ' + t + ' 0px',
      zIndex:          1,
    };
  } else {
    boxStyle = {
      width:           inputWidth ? inputWidth : '100%',
      maxWidth:        inputMaxWidth ? inputMaxWidth : '200px',
      display:         'flex',
      flexDirection:   'column',
      justifyContent:  'flex-start',
      alignItems:      'flex-start',
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
