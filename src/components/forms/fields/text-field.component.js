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
    const {state} = this.props;
    const disabled = Action.isDisabled (state);
    const inputValue = this.read ('value');

    let boxStyle   = this.mergeStyles ('box');
    let fieldStyle = this.mergeStyles ('field');

    return (
      <span
        disabled={disabled}
        style={boxStyle}
        >
        <input
          onChange={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
          onSelect={this.onSelect}
          disabled={disabled}
          maxLength={this.props.maxLength}
          placeholder={this.props.hintText || this.read ('hintText')}
          size={this.props.size || 'size'}
          style={fieldStyle}
          type={this.props.type || 'text'}
          key='input'
          value={inputValue}
          {...this.props}
          />
      </span>
    );
  }
}

/******************************************************************************/
