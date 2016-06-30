'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  let   inputGrow           = props.grow;
  const inputSpacing        = props.spacing;
  let   inputWidth          = props.width;
  const inputShape          = props.shape;
  const inputMessageInfo    = props.messageInfo;
  const inputMessageWarning = props.messageWarning;

  const m = Unit.multiply (theme.shapes.containerMargin, 0.5);

  if (!inputGrow) {
    inputGrow = 1;
  }

  if (!inputWidth) {
    inputWidth = '10px';  // any non-zero width
  } else {
    inputGrow = null;  // if specific with exist, don't fill
  }

  // If component has specific width and border, reduce the width to
  // take into account the thickness of the borders left and right.
  if (inputWidth) {
    inputWidth = Unit.sub (inputWidth, '2px');
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
    borderRadius = r + ' 0px 0px ' + r;
    if (inputShape === 'left-rounded') {
      borderRadius = r + ' 0px 0px ' + r;
      padding      = '0px 0px 0px ' + r;
    } else if (inputShape === 'right-rounded') {
      borderRadius = '0px ' + r + ' ' + r + ' 0px';
      padding      = '0px ' + r + ' 0px 0px';
    }
  }

  const boxStyle = {
    display:         'flex',
    flexDirection:   'row',
    justifyContent:  'flex-start',
    alignItems:      'center',
    flexGrow:        inputGrow,
    border:          '1px solid ' + theme.palette.buttonBorder,
    borderRadius:    borderRadius,
    backgroundColor: theme.palette.textFieldBackground,
    padding:         padding,
    marginTop:       '0px',
    marginRight:     marginRight,
    marginBottom:    '0px',
    marginLeft:      marginLeft,
    position:        'relative',
  };

  const fieldStyle = {
    flexGrow:        1,
    width:           inputWidth,
    height:          theme.shapes.lineHeight,
    border:          'none',
    padding:         '10px',
    margin:          '0px',
  };

  const messageMargin = theme.shapes.messageMargin;
  const messageBoxStyle = {
    position:        'absolute',
    left:            '-1px',
    top:             Unit.add (theme.shapes.lineHeight, '1px'),
    color:           inputMessageInfo ? theme.palette.messageInfoText : theme.palette.messageWarningText,
    backgroundColor: inputMessageInfo ? theme.palette.messageInfoBackground : theme.palette.messageWarningBackground,
    fontSize:        theme.shapes.messageTextSize,
    zIndex:          1,
    display:         'flex',
    flexDirection:   'column',
  };
  const messageTopStyle = {
    display:         'inline-block',
    verticalAlign:   'middle',
    fontWeight:      'bold',
    padding:         messageMargin + ' ' + messageMargin + ' 0px ' + messageMargin,
  };
  const messageBottomStyle = {
    display:         'inline-block',
    verticalAlign:   'middle',
    padding:         messageMargin,
  };

  return {
    box:           boxStyle,
    field:         fieldStyle,
    messageBox:    messageBoxStyle,
    messageTop:    messageTopStyle,
    messageBottom: messageBottomStyle,
  };
}

/******************************************************************************/
