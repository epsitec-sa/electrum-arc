'use strict';

/******************************************************************************/

export default function styles (theme, props) {
  const inputLeft   = props.left;
  const inputWidth  = props.width;
  const inputTop    = props.top;
  const inputHeight = props.height;

  const baseStyle = {
    position:        'absolute',
    left:            inputLeft,
    width:           inputWidth,
    top:             inputTop,
    height:          inputHeight,
    backgroundColor: theme.palette.chronoEventBackground,
    userSelect:      'none',
  };

  const tooltipStyle = {
    position:        'absolute',
    display:         'flex',
    flexDirection:   'row',
    left:            '100%',
    width:           '1000px',
    height:          '100%',
    margin:          '0px 0px 0px 10px',
    userSelect:      'none',
  };

  return {
    base:    baseStyle,
    tooltip: tooltipStyle,
  };
}

/******************************************************************************/
