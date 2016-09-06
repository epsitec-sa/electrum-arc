'use strict';

import React from 'react';
import {Action} from 'electrum';

/******************************************************************************/

export default class Separator extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      kind:   this.read ('kind'),
      width:  this.read ('width'),
      height: this.read ('height'),
    };
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);

    const boxStyle = this.mergeStyles ('box');

    return (
      <div
        disabled={disabled}
        style={boxStyle}
        {...this.props}
        />
    );
  }
}

/******************************************************************************/
