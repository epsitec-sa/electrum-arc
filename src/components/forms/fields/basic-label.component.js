'use strict';

import React from 'react';
import {Action} from 'electrum';
/******************************************************************************/

export default class BasicLabel extends React.Component {
  render () {
    const {state, text, grow} = this.props;
    const disabled = Action.isDisabled (state);
    var inputText = text || state.get ('text');
    var inputGrow = grow || state.get ('grow');

    var labelStyle = {
      flexGrow: inputGrow,
    };

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
