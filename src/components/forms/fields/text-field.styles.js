'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  let   inputGrow    = props.grow;
  const inputSpacing = props.spacing;
  let   inputWidth   = props.width;
  const inputTooltip = props.tooltip;

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

  let boxStyle = {
    display:         'flex',
    flexDirection:   'row',
    justifyContent:  'flex-start',
    alignItems:      'center',
    flexGrow:        inputGrow,
    border:          '1px solid ' + theme.palette.buttonBorder,
    backgroundColor: theme.palette.buttonBackground,
    padding:         '0px',
    marginTop:       '0px',
    marginLeft:      '0px',
    marginBottom:    '0px',
    marginRight:     '0px',
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

  if (inputSpacing === 'overlap') {
    boxStyle.marginRight = '-1px';
  } else if (inputSpacing === 'large') {
    boxStyle.marginRight = m;
  }

  const tooltipMargin = theme.shapes.tooltipMargin;
  const tooltipStyle1 = {
    position:        'absolute',
    left:            '-1px',
    top:             inputTooltip ? Unit.add (theme.shapes.lineHeight, '1px') : '0px',
    color:           theme.palette.tooltipText,
    backgroundColor: inputTooltip ? theme.palette.tooltipBackground : 'transparent',
    fontSize:        theme.shapes.tooltipTextSize,
    zIndex:          1,
    transition:      theme.transitions.easeOut (),
    display:         'flex',
    flexDirection:   'column',
  };
  const tooltipStyle2 = {
    display:         'inline-block',
    verticalAlign:   'middle',
    fontWeight:      'bold',
    padding:         tooltipMargin + ' ' + tooltipMargin + ' 0px ' + tooltipMargin,
  };
  const tooltipStyle3 = {
    display:         'inline-block',
    verticalAlign:   'middle',
    padding:         tooltipMargin,
  };

  return {
    box:      boxStyle,
    field:    fieldStyle,
    tooltip1: tooltipStyle1,
    tooltip2: tooltipStyle2,
    tooltip3: tooltipStyle3,
  };
}

/******************************************************************************/
