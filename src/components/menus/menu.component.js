'use strict';

import React from 'react';
import {Action} from 'electrum';

/******************************************************************************/

export default class Menu extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      width: this.read ('width'),
    };
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);
    const inputItems = this.read ('items');

    const boxStyle = this.mergeStyles ('box');

    return (
      <div
        disabled={disabled}
        style={boxStyle}
        {...this.props}
      >
        {inputItems.map (item => item ())}
      </div>
    );
  }
}

/******************************************************************************/
