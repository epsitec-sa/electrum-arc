'use strict';

/******************************************************************************/

export default function styles (theme, props) {
  const fullScreenStyle = {
    visibility:      'visible',
    position:        'fixed',
    zIndex:          10,
    top:             '0px',
    left:            '0px',
    width:           '100%',
    height:          '100%',
    userSelect:      'none',
    cursor:          'not-allowed',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  };

  return {
    fullScreen: fullScreenStyle,
  };
}

/******************************************************************************/
