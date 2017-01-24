'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const inputGrow           = props.grow;
  const inputSpacing        = props.spacing;
  const inputWidth          = props.width;
  const inputShape          = props.shape;
  const inputReadonly       = props.readonly;

  let flexGrow    = inputGrow;
  let flexShrink  = null;
  let flexBasis   = null;
  let width       = inputWidth;

  const m = Unit.multiply (theme.shapes.containerMargin, 0.5);

  if (!flexGrow) {
    flexGrow = 1;
  }
  if (flexGrow) {
    flexShrink = '1';
    flexBasis  = '0%';
  }

  if (!width) {
    width = '10px';  // any non-zero width
  } else {
    width = null;  // if specific with exist, don't fill
  }

  // If component has specific width and border, reduce the width to
  // take into account the thickness of the borders left and right.
  if (width) {
    width = Unit.sub (width, '2px');
  }

  let marginLeft   = '0px';
  let marginRight  = '0px';
  let padding      = '0px';
  let borderRadius = '0px';

  if (inputSpacing === 'overlap') {
    marginRight = '-1px';
  } else if (inputSpacing === 'large') {
    marginRight = m;
  }

  if (inputShape) {
    const r = Unit.multiply (theme.shapes.lineHeight, 0.5);
    const s = theme.shapes.smoothRadius;
    borderRadius = r + ' 0px 0px ' + r;
    if (inputShape === 'left-rounded') {
      borderRadius = r + ' 0px 0px ' + r;
      padding      = '0px 0px 0px ' + r;
    } else if (inputShape === 'right-rounded') {
      borderRadius = '0px ' + r + ' ' + r + ' 0px';
      padding      = '0px ' + r + ' 0px 0px';
    } else if (inputShape === 'left-smooth') {
      borderRadius = s + ' 0px 0px ' + s;
      padding      = '0px 0px 0px ' + s;
    } else if (inputShape === 'right-smooth') {
      borderRadius = '0px ' + s + ' ' + s + ' 0px';
      padding      = '0px ' + s + ' 0px 0px';
    }
  }

  const bg = (inputReadonly === 'true') ? theme.palette.textFieldReadonlyBackground : theme.palette.textFieldBackground;
  const boxStyle = {
    display:         'flex',
    flexDirection:   'row',
    justifyContent:  'flex-start',
    alignItems:      'flex-start',
    flexGrow:        flexGrow,
    flexShrink:      flexShrink,
    flexBasis:       flexBasis,
    border:          '1px solid ' + theme.palette.buttonBorder,
    borderRadius:    borderRadius,
    backgroundColor: bg,
    padding:         padding,
    marginTop:       '0px',
    marginRight:     marginRight,
    marginBottom:    '0px',
    marginLeft:      marginLeft,
    position:        'relative',
  };

  const fieldStyle = {
    flexGrow:        1,
    width:           width,
    height:          theme.shapes.lineHeight,
    border:          'none',
    padding:         '10px',
    margin:          '0px',
    backgroundColor: bg,
  };

  const textareaStyle = {
    flexGrow: 1,
    padding:  '10px',
    resize:   'none',
    border:   'none',
  };

  return {
    box:      boxStyle,
    field:    fieldStyle,
    textarea: textareaStyle,
  };
}

/******************************************************************************/