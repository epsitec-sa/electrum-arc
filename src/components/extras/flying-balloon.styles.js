'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const inputWidth = props.width;

  const t = Unit.add (theme.shapes.flyingBalloonTriangleSize, '0px', 0);  // suppress decimals
  const p = theme.shapes.flyingBalloonPadding;

  const boxStyle = {
    width:           inputWidth,
    display:         'flex',
    flexDirection:   'row',
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

  const primaryTextStyle = {
    display:         'inline-block',
    verticalAlign:   'middle',
    fontWeight:      'bold',
    padding:         '0px',
  };

  const secondaryTextStyle = {
    display:         'inline-block',
    verticalAlign:   'middle',
    padding:         p + ' 0px 0px 0px',
  };

  return {
    box:           boxStyle,
    triangle:      triangleStyle,
    primaryText:   primaryTextStyle,
    secondaryText: secondaryTextStyle,
  };
}

/******************************************************************************/
