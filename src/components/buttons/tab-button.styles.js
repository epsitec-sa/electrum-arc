'use strict';

import {Action} from 'electrum';

/******************************************************************************/

export default function styles (theme, props) {
  const {state} = props;
  const disabled = Action.isDisabled (state);
  const inputKind  = props.kind;
  const inputGlyph = props.glyph;

  const boxStyle = {
    display:         'flex',
    flexDirection:   'row',
    justifyContent:  'flex-start',
    alignItems:      'center',
    padding:         '0px',
    marginTop:       '0px',
    marginLeft:      '0px',
    marginBottom:    '0px',
    marginRight:     '0px',
  };

  return {
    box: boxStyle,
  };
}

/******************************************************************************/
