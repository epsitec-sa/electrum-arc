'use strict';

import React from 'react';
import {Action} from 'electrum';
/******************************************************************************/

export default class ContentContainer extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state, width, height} = this.props;
    const disabled = Action.isDisabled (state);
    const inputWidth   = width   || state.get ('width');
    const inputHeight  = height  || state.get ('height');

    var containerStyle = {
      width:           inputWidth,
      height:          inputHeight,
      border:          'none',
      padding:         '20px 20px 10px 20px',
      margin:          '0px',
      color:           '#333',
      backgroundColor: '#fff',
    };

    return (
      <div
        disabled={disabled}
        style={containerStyle}
        {...this.props}
        />
    );
  }
}

/******************************************************************************/
