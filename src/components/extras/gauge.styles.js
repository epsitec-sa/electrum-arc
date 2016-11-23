'use strict';

/******************************************************************************/

//  Compute the color of gauge.
//  100 -> red
//   75 -> orange
//   50 -> yellow
//   25 -> yellow
//    0 -> yellow
function getColor (value) {
  if (value) {
    value = Math.max ((value * 2) - 100, 0);  // 100/50/0 -> 100/0/0
    const green = Math.floor (((100 - value) * 2.55), 0).toString (16);  // to hexa
    if (green.length === 1) {  // one digit ?
      return `#f${green}0`;
    } else {  // two digit ?
      return `#ff${green}00`;
    }
  } else {
    return '#fff';
  }
}

export default function styles (theme, props) {
  const inputValue = Math.max (Math.min (props.value, 100), 0);  // 0..100

  const boxStyle = {
    display:         'flex',
    height:          '100%',
    alignItems:      'flex-end',
  };

  //  Compute radius at left border, for including into left of Ticket kind='thin'.
  const topLeftRadius    = (inputValue >= 90) ? '10px' : '0px';
  const bottomLeftRadius = '10px';

  const contentStyle = {
    height:          inputValue + '%',
    width:           '100%',
    borderRadius:    `${topLeftRadius} 0px 0px ${bottomLeftRadius}`,
    backgroundColor: getColor (inputValue),
  };

  return {
    box:     boxStyle,
    content: contentStyle,
  };
}

/******************************************************************************/
