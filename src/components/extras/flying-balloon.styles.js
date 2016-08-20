'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const inputWidth       = props.width;
  const inputPrimaryText = props.primaryText;

  const t = Unit.add (theme.shapes.flyingBalloonTriangleSize, '0px', 0);  // round (suppress decimals)
  const p = theme.shapes.flyingBalloonPadding;

  const boxStyle = {
    width:           inputWidth,
    display:         'flex',
    flexDirection:   'column',
    justifyContent:  'center',
    alignItems:      'center',
    position:        'absolute',
    left:            '-1px',
    top:             '100%',
    margin:          t + ' 0px 0px 0px',
    fontSize:        theme.shapes.flyingBalloonTextSize,
    color:           theme.palette.flyingBalloonText,
    backgroundColor: theme.palette.flyingBalloonBackground,
    zIndex:          1,
  };

  const contentStyle = {
    display:         'flex',
    flexDirection:   'column',
  };

  const primaryTextStyle = {
    display:         'inline-block',
    verticalAlign:   'middle',
    fontWeight:      'bold',
    padding:         '0px',
  };

  const secondaryTextStyle = {
    display:         'inline-block',
    verticalAlign:   'middle',
    padding:         (inputPrimaryText ? p : '0px') + ' 0px 0px 0px',
  };

  return {
    box:           boxStyle,
    content:       contentStyle,
    primaryText:   primaryTextStyle,
    secondaryText: secondaryTextStyle,
  };
}

/******************************************************************************/
