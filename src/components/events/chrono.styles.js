'use strict';

import {ColorManipulator} from 'electrum';
import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const inputHeight = props.height;
  const padding = '5px';
  const height = Unit.sub (inputHeight, Unit.multiply (padding, 2));

  const baseStyle = {
    height:          height,
    overflow:        'hidden',
    border:          '1px solid ' + theme.palette.eventBorder,
    padding:         padding,
    backgroundColor: theme.palette.eventColumnBackground,
    textDecoration:  'none',
    cursor:          'default',
  };

  const hoverStyle = {
    minHeight:       height,
    border:          '1px solid ' + theme.palette.eventBorder,
    padding:         padding,
    backgroundColor: ColorManipulator.emphasize (theme.palette.eventColumnBackground, 0.1),
    textDecoration:  'none',
    cursor:          'default',
  };

  return {
    base:  baseStyle,
    hover: hoverStyle,
  };
}

/******************************************************************************/
