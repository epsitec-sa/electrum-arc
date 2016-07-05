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
      width:         this.read ('width'),
      primaryText:   this.read ('primary-text'),
      secondaryText: this.read ('secondary-text'),
    };
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);
    const inputPrimaryText   = this.read ('primary-text');
    const inputSecondaryText = this.read ('secondary-text');

    const boxStyle           = this.mergeStyles ('box');
    const triangleStyle      = this.mergeStyles ('triangle');
    const contentStyle       = this.mergeStyles ('content');
    const primaryTextStyle   = this.mergeStyles ('primaryText');
    const secondaryTextStyle = this.mergeStyles ('secondaryText');

    const htmlTriangle = (
      <div style={triangleStyle} />
    );

    let htmlContent;
    if (inputPrimaryText && inputSecondaryText) {
      htmlContent = (
        <div style={contentStyle}>
          <div style={primaryTextStyle}>{inputPrimaryText}</div>
          <div style={secondaryTextStyle}>{inputSecondaryText}</div>
        </div>
      );
    } else if (inputPrimaryText) {
      htmlContent = (
        <div style={contentStyle}>
          <div style={primaryTextStyle}>{inputPrimaryText}</div>
        </div>
      );
    } else if (inputSecondaryText) {
      htmlContent = (
        <div style={contentStyle}>
          <div style={secondaryTextStyle}>{inputSecondaryText}</div>
        </div>
      );
    }

    return (
      <div
        disabled={disabled}
        style={boxStyle}
        {...this.props}
      >
        {htmlTriangle}
        {htmlContent}
      </div>
    );
  }
}

/******************************************************************************/
