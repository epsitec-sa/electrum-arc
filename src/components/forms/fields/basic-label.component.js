'use strict';

import React from 'react';
import {Action} from 'electrum';
/******************************************************************************/

export default class BasicLabel extends React.Component {
  render () {
    const {state, text, grow, info} = this.props;
    const disabled = Action.isDisabled (state);
    const inputText = text || state.get ('text');
    const inputGrow = grow || state.get ('grow');
    const inputInfo = info || state.get ('info');

    var labelStyle = {
      display:         'flex',
      flexDirection:   'row',
      justifyContent:  'flex-start',
      alignItems:      'center',
      height:          '32px',
      flexGrow:        inputGrow,
    };

    if (inputInfo) {
      labelStyle.backgroundColor = '#ddd';
      labelStyle.fontSize        = '75%';
      labelStyle.justifyContent  = 'center';
      labelStyle.padding         = '0 10px 0 10px';
    }

    return (
      <label
        disabled={disabled}
        style={labelStyle}
        >
        {inputText}
      </label>
    );
  }
}

/******************************************************************************/
