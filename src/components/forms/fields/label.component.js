'use strict';

import React from 'react';
import {Action} from 'electrum';
/******************************************************************************/

export default class Label extends React.Component {
  render () {
    const {state, text, grow, kind} = this.props;
    const disabled = Action.isDisabled (state);
    const inputText = text || state.get ('text');
    const inputGrow = grow || state.get ('grow');
    const inputKind = kind || state.get ('kind');

    var labelStyle = {
      display:         'flex',
      flexDirection:   'row',
      justifyContent:  'flex-start',
      alignItems:      'center',
      height:          '32px',
      flexGrow:        inputGrow,
    };

    if (inputKind === 'info') {
      labelStyle.backgroundColor = '#ddd';
      labelStyle.fontSize        = '75%';
      labelStyle.justifyContent  = 'center';
      labelStyle.padding         = '0 10px 0 10px';
    }

    return (
      <label
        disabled={disabled}
        style={labelStyle}
        {...this.props}
        >
        {inputText}
      </label>
    );
  }
}

/******************************************************************************/
