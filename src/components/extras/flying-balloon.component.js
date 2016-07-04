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
    const inputText          = this.read ('text');
    const inputPrimaryText   = this.read ('primary-text');
    const inputSecondaryText = this.read ('secondary-text');

    const boxStyle      = this.mergeStyles ('box');
    const triangleStyle = this.mergeStyles ('triangle');

    const htmlTriangle = (
      <div style={triangleStyle} />
    );

    let htmlContent;
    if (inputText) {
      const primaryTextStyle = this.mergeStyles ('primaryText');
      htmlContent = (
        <div>
          <span style={primaryTextStyle}>{inputText}</span>
        </div>
      );
    } else if (inputPrimaryText && inputSecondaryText) {
      const primaryTextStyle   = this.mergeStyles ('primaryText');
      const secondaryTextStyle = this.mergeStyles ('secondaryText');
      htmlContent = (
        <div>
          <span style={primaryTextStyle}>{inputPrimaryText}</span>
          <span style={secondaryTextStyle}>{inputSecondaryText}</span>
        </div>
      );
    }

    return (
      <div
        disabled={disabled}
        style={boxStyle}
        {...this.props}
      >
        {htmlContent}
        {htmlTriangle}
      </div>
    );
  }
}

/******************************************************************************/
