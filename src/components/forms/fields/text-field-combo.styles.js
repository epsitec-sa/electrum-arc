'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  let   inputGrow     = props.grow;
  const inputSpacing  = props.spacing;

  if (!inputGrow) {
    inputGrow = 1;
  }

  let marginRight = '0px';
  if (inputSpacing === 'overlap') {
    marginRight = '-1px';
  } else if (inputSpacing === 'large') {
    marginRight = theme.shapes.lineSpacing;
  }

  const boxStyle = {
    display:        'flex',
    flexDirection:  'row',
    justifyContent: 'flex-start',
    alignItems:     'center',
    flexGrow:       inputGrow,
    padding:        '0px',
    marginTop:      '0px',
    marginLeft:     '0px',
    marginBottom:   '0px',
    marginRight:    marginRight,
  };

  const comboBoxStyle = {
    position:        'absolute',
    left:            '-1px',
    top:             Unit.add (theme.shapes.lineHeight, '1px'),
    padding:         theme.shapes.containerMargin,
    color:           theme.palette.tooltipText,
    backgroundColor: theme.palette.tooltipBackground,
    zIndex:          1,
    display:         'flex',
    flexDirection:   'column',
  };

  return {
    box:      boxStyle,
    comboBox: comboBoxStyle,
  };
}

/******************************************************************************/
