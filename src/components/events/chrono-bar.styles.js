'use strict';

import {ColorManipulator} from 'electrum';

/******************************************************************************/

export default function styles (theme, props) {
  const inputLeft   = props.left;
  const inputWidth  = props.width;
  const inputTop    = props.top;
  const inputHeight = props.height;

  const baseStyle = {
    position:        'absolute',
    left:            inputLeft,
    width:           inputWidth,
    top:             inputTop,
    height:          inputHeight,
    backgroundColor: theme.palette.chronoEventBackground,
    userSelect:      'none',
  };

  const hoverStyle = {
    position:        'absolute',
    left:            inputLeft,
    width:           inputWidth,
    top:             inputTop,
    height:          inputHeight,
    backgroundColor: ColorManipulator.emphasize (theme.palette.chronoEventBackground, 0.2),
    userSelect:      'none',
  };

  const tooltipStyle = {
    position:        'absolute',
    display:         'flex',
    flexDirection:   'row',
    left:            '100%',
    width:           '1000px',
    height:          '100%',
    margin:          '0px 0px 0px 10px',
    zIndex:          2,
  };

  return {
    base:    baseStyle,
    hover:   hoverStyle,
    tooltip: tooltipStyle,
  };
}

/******************************************************************************/
