'use strict';

import React from 'react';
import {Action} from 'electrum';

/******************************************************************************/

export default class FlyingBalloon extends React.Component {

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
    const inputText = this.read ('text');

    const boxStyle   = this.mergeStyles ('box');

    const d = '10px';
    const triangleStyle = {
      position:     'absolute',
      right:        '50%',
      top:          '-10px',
      borderLeft:   d + ' solid transparent',
      borderRight:  d + ' solid transparent',
      borderBottom: d + ' solid #f00',
    };
    const htmlTriangle = (
      <div style={triangleStyle} />
    );

    return (
      <div
        disabled={disabled}
        style={boxStyle}
        {...this.props}
        >
        <label
          {...this.props}
        >
          {inputText}
        </label>
        {htmlTriangle}
      </div>
    );
  }
}

/******************************************************************************/
