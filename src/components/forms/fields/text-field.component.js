'use strict';

import React from 'react';
import {Action} from 'electrum';
import {FlyingBalloon} from 'electrum-arc';

/******************************************************************************/

export default class TextField extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      value:          this.read ('value'),
      grow:           this.read ('grow'),
      spacing:        this.read ('spacing'),
      width:          this.read ('width'),
      shape:          this.read ('shape'),
      messageInfo:    this.read ('message-info'),
      messageWarning: this.read ('message-warning'),
    };
  }

  render () {
    const {state, id} = this.props;
    const disabled = Action.isDisabled (state);
    const inputValue          = this.read ('value');
    const inputMessageInfo    = this.read ('message-info');
    const inputMessageWarning = this.read ('message-warning');
    const inputHintText       = this.read ('hint-text');

    const boxStyle   = this.mergeStyles ('box');
    const fieldStyle = this.mergeStyles ('field');

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
        id={id}
        />
    );

    let htmlFlyingBalloon = null;
    if (inputMessageInfo || inputMessageWarning) {
      let topText    = null;
      let bottomText = null;
      const message = inputMessageInfo ? inputMessageInfo : inputMessageWarning;
      const i = message.indexOf ('|');
      if (i) {
        topText    = message.substring (0, i);
        bottomText = message.substring (i + 1, message.length);
      } else {
        bottomText = message;
      }
      htmlFlyingBalloon = (
        <FlyingBalloon primary-text={topText} secondary-text={bottomText} {...this.link ()} />
      );
    }

    return (
     <span
       disabled={disabled}
       style={boxStyle}
       >
       {htmlInput}
       {htmlFlyingBalloon}
     </span>
    );
  }
}

/******************************************************************************/
