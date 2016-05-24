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
    const inputValue   = this.read ('value');
    const inputTooltip = this.read ('tooltip');

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
        placeholder={this.props.hintText || this.read ('hint-text')}
        size={this.props.size || 'size'}
        style={fieldStyle}
        type={this.props.type || 'text'}
        key='input'
        value={inputValue}
        />
    );

    let htmlTooltip = null;
    const ii = inputTooltip ? inputTooltip.indexOf ('|') : undefined;
    if (ii) {
      const x1 = inputTooltip.substring (0, ii);
      const x2 = inputTooltip.substring (ii + 1, inputTooltip.length);
      htmlTooltip = (
        <div style={tooltipStyle1}>
          <span style={tooltipStyle2}>{x1}</span>
          <span style={tooltipStyle3}>{x2}</span>
        </div>
      );
    } else {
      htmlTooltip = (
        <div style={tooltipStyle1}>
          <span style={tooltipStyle3}>{inputTooltip}</span>
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
