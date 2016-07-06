'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  let   inputGrow      = props.grow;
  const inputSpacing   = props.spacing;
  const comboDirection = props.comboDirection;

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
    position:       'relative',
  };

  const comboBoxStyle = {
    position:        'absolute',
    right:           (comboDirection === 'right') ? null : '0px',
    left:            (comboDirection === 'right') ? '0px' : null,
    top:             Unit.add (theme.shapes.lineHeight, '1px'),
    marginTop:       theme.shapes.lineSpacing,
    zIndex:          1,
    display:         'flex',
    flexDirection:   'column',
  };

  const emptyComboStyle = {
    margin: theme.shapes.containerMargin,
  };

  return {
    box:        boxStyle,
    comboBox:   comboBoxStyle,
    emptyCombo: emptyComboStyle,
  };
}

/******************************************************************************/
