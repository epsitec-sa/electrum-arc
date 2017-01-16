'use strict';

import React from 'react';
import {Action} from 'electrum';

/******************************************************************************/

export default class Badge extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      kind:  this.read ('kind'),
      value: this.read ('value'),
      layer: this.read ('layer'),
    };
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);
    const inputValue = this.read ('value');

    let truncatedValue = inputValue ? inputValue.toString () : '';
    if (truncatedValue.length > 3) {
      truncatedValue = truncatedValue.substring (0, 3) + '...';
    }

    const boxStyle   = this.mergeStyles ('box');
    const labelStyle = this.mergeStyles ('label');

    return (
      <div
        disabled = {disabled}
        style    = {boxStyle}
        >
        <label
          style = {labelStyle}
          >
          {truncatedValue}
        </label>
      </div>
    );
  }
}

/******************************************************************************/
