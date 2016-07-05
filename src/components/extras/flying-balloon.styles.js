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
    padding:         p,
    fontSize:        theme.shapes.flyingBalloonTextSize,
    color:           theme.palette.flyingBalloonText,
    backgroundColor: theme.palette.flyingBalloonBackground,
    zIndex:          1,
  };

  const triangleStyle = {
    position:     'absolute',
    right:        '50%',
    top:          '-' + t,
    margin:       '0px -' + t + ' 0px 0px',
    borderLeft:   t + ' solid transparent',
    borderRight:  t + ' solid transparent',
    borderBottom: t + ' solid ' + theme.palette.flyingBalloonBackground,
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
    triangle:      triangleStyle,
    content:       contentStyle,
    primaryText:   primaryTextStyle,
    secondaryText: secondaryTextStyle,
  };
}

/******************************************************************************/
