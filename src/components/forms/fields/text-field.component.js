'use strict';

import React from 'react';
import {Action} from 'electrum';
import {Unit} from 'electrum-theme';

/******************************************************************************/

export default class TextField extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      value:   this.read ('value'),
      grow:    this.read ('grow'),
      spacing: this.read ('spacing'),
      width:   this.read ('width'),
      tooltip: this.read ('tooltip'),
    };
  }

  render () {
    const {state, theme} = this.props;
    const disabled = Action.isDisabled (state);
    const inputValue    = this.read ('value');
    const inputTooltip  = this.read ('tooltip');
    const inputHintText = this.props.hintText || this.read ('hint-text');

    const boxStyle      = this.mergeStyles ('box');
    const fieldStyle    = this.mergeStyles ('field');
    const tooltipStyle1 = this.mergeStyles ('tooltip1');
    const tooltipStyle2 = this.mergeStyles ('tooltip2');
    const tooltipStyle3 = this.mergeStyles ('tooltip3');

    const htmlInput = (
      <input
        onChange={this.onChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        onSelect={this.onSelect}
        disabled={disabled}
        maxLength={this.props.maxLength}
        placeholder={inputHintText}
        size={this.props.size || 'size'}
        style={fieldStyle}
        type={this.props.type || 'text'}
        key='input'
        value={inputValue}
        />
    );

    let message = null;
    let tooltip = null;
    if (inputTooltip) {
      const i = inputTooltip.indexOf ('|');
      if (i) {
        message = inputTooltip.substring (0, i);
        tooltip = inputTooltip.substring (i + 1, inputTooltip.length);
      } else {
        tooltip = inputTooltip;
      }
    }
    // if (!message) {
    //   message = inputHintText;
    // }
    let htmlTooltip = null;
    if (message && tooltip) {
      htmlTooltip = (
        <div style={tooltipStyle1}>
          <span style={tooltipStyle2}>{message}</span>
          <span style={tooltipStyle3}>{tooltip}</span>
        </div>
      );
    } else if (tooltip) {
      htmlTooltip = (
        <div style={tooltipStyle1}>
          <span style={tooltipStyle3}>{tooltip}</span>
        </div>
      );
    }

    return (
      <span
        disabled={disabled}
        style={boxStyle}
        >
        {htmlInput}
        {htmlTooltip}
      </span>
    );
  }
}

/******************************************************************************/
