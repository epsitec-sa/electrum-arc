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
    };
  }

  render () {
    const {state, theme} = this.props;
    const disabled = Action.isDisabled (state);
    const inputValue   = this.read ('value');
    const inputTooltip = this.read ('tooltip');
    const boxStyle     = this.mergeStyles ('box');
    const fieldStyle   = this.mergeStyles ('field');

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

    const h = theme.shapes.tooltipHeight;
    const m = theme.shapes.tooltipMargin;
    const tooltipStyle = {
      position:        'absolute',
      left:            '-1px',
      bottom:          inputTooltip ? Unit.sub (Unit.multiply (h, -1), '1px') : '0px',
      height:          h,
      lineHeight:      h,
      padding:         '0px ' + m + ' 0px ' + m,
      color:           theme.palette.tooltipText,
      backgroundColor: inputTooltip ? theme.palette.tooltipBackground : 'transparent',
      fontSize:        theme.shapes.tooltipTextSize,
      zIndex:          1,
      transition:      theme.transitions.easeOut (),
    };
    const textStyle = {
      display:       'inline-block',
      verticalAlign: 'middle',
    };
    const htmlTooltip = (
      <div style={tooltipStyle}>
        <span style={textStyle}>{inputTooltip}</span>
      </div>
    );

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
