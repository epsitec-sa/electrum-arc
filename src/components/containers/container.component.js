'use strict';

import React from 'react';
import {Action} from 'electrum';

/******************************************************************************/

export default class Container extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      inputWidth:      this.read ('width'),
      inputHeight:     this.read ('height'),
      inputKind:       this.read ('kind'),
      inputHeightType: this.read ('height-type'),
      inputSpacing:    this.read ('spacing'),
    };
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);

    let boxStyle = this.getStyles ('box');

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
