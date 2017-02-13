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
  const width  = inputWidth;
  const height = inputHeight;

  const baseStyle = {
    position:        'absolute',
    left:            inputLeft,
    width:           width,
    top:             inputTop,
    height:          height,
    overflow:        'hidden',
    border:          '1px solid ' + theme.palette.eventBorder,
    backgroundColor: theme.palette.eventColumnBackground,
    textDecoration:  'none',
    cursor:          'default',
    zIndex:          '1',
  };

  const hoverStyle = {
    position:        'absolute',
    left:            inputLeft,
    width:           width,
    top:             inputTop,
    height:          height,
    overflow:        'hidden',
    border:          '1px solid ' + theme.palette.eventBorder,
    backgroundColor: ColorManipulator.emphasize (theme.palette.eventColumnBackground, 0.1),
    textDecoration:  'none',
    cursor:          'default',
    zIndex:          '2',
  };

  const contentStyle = {
    padding:         padding,
  };

  return {
    base:    baseStyle,
    hover:   hoverStyle,
    content: contentStyle,
  };
}

/******************************************************************************/
