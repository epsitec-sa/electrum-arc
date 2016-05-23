'use strict';

import React from 'react';
import {Action} from 'electrum';

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
    // TEST
    const inputToto = this.read ('toto');
    const boxStyle   = this.mergeStyles ('box');
    const fieldStyle = this.mergeStyles ('field');

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
          placeholder={this.props.hintText || this.read ('hint-text')}
          size={this.props.size || 'size'}
          style={fieldStyle}
          type={this.props.type || 'text'}
          key='input'
          value={inputValue}
          />
        <span>{inputToto}</span>
      </span>
    );
  }
}

/******************************************************************************/
