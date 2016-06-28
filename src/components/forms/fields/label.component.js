'use strict';

import React from 'react';
import {Action} from 'electrum';
import {Unit} from 'electrum-theme';

/******************************************************************************/

export default class Label extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      text:    this.read ('text'),
      glyph:   this.read ('glyph'),
      grow:    this.read ('grow'),
      kind:    this.read ('kind'),
      width:   this.read ('width'),
      spacing: this.read ('spacing'),
    };
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);
    const inputText = this.read ('text');

    let labelStyle = this.mergeStyles ('label');

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
