'use strict';

import {ColorManipulator} from 'electrum';
import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const inputLeft   = props.left;
  const inputWidth  = props.width;
  const inputTop    = props.top;
  const inputHeight = props.height;
  const padding = '5px';
  // const width  = Unit.sub (inputWidth,  Unit.multiply (padding, 2));
  // const height = Unit.sub (inputHeight, Unit.multiply (padding, 2));
  const width  = Unit.sub (inputWidth,  Unit.multiply (padding, 2));
  const height = 'calc(' + inputHeight + ' - ' + Unit.multiply (padding, 2) + ')';

  const baseStyle = {
    position:        'absolute',
    left:            inputLeft,
    minWidth:        width,
    maxWidth:        width,
    top:             inputTop,
    minHeight:       height,
    maxHeight:       height,
    overflow:        'hidden',
    border:          '1px solid ' + theme.palette.eventBorder,
    padding:         padding,
    backgroundColor: theme.palette.eventColumnBackground,
    textDecoration:  'none',
    cursor:          'default',
    zIndex:          '1',
  };

  const hoverStyle = {
    position:        'absolute',
    left:            inputLeft,
    minWidth:        width,
    top:             inputTop,
    minHeight:       height,
    border:          '1px solid ' + theme.palette.eventBorder,
    padding:         padding,
    backgroundColor: ColorManipulator.emphasize (theme.palette.eventColumnBackground, 0.1),
    textDecoration:  'none',
    cursor:          'default',
    zIndex:          '10',
  };

  return {
    base:  baseStyle,
    hover: hoverStyle,
  };
}

/******************************************************************************/
