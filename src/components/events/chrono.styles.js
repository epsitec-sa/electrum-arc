'use strict';

import {ColorManipulator} from 'electrum';

/******************************************************************************/

export default function styles (theme, props) {
  const inputHeight = props.height;

  const baseStyle = {
    height:          inputHeight,
    overflow:        'hidden',
    border:          '1px solid ' + theme.palette.eventBorder,
    padding:         '5px',
    backgroundColor: theme.palette.eventColumnBackground,
    textDecoration:  'none',
    cursor:          'default',
  };

  const hoverStyle = {
    minHeight:       inputHeight,
    border:          '1px solid ' + theme.palette.eventBorder,
    padding:         '5px',
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
