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
    const {state} = this.props;
    const disabled = Action.isDisabled (state);
    const id                       = this.read ('id');
    const inputValue               = this.read ('value');
    const inputMessageWarning      = this.read ('message-warning');
    const inputMessageInfo         = this.read ('message-info');
    const inputHintText            = this.read ('hint-text');
    const inputFlyingBalloonAnchor = this.read ('flying-balloon-anchor');
    const inputRows                = this.read ('rows');
    const inputTabIndex            = this.props['tab-index'];

    const boxStyle      = this.mergeStyles ('box');
    const fieldStyle    = this.mergeStyles ('field');
    const textareaStyle = this.mergeStyles ('textarea');

    const htmlInput = inputRows ?
    (
      <textarea
        id          = {id}
        style       = {textareaStyle}
        onChange    = {this.onChange}
        onFocus     = {this.onFocus}
        onBlur      = {this.onBlur}
        onKeyDown   = {this.onKeyDown}
        onKeyUp     = {this.onKeyUp}
        onSelect    = {this.onSelect}
        disabled    = {disabled}
        rows        = {inputRows}
        tabIndex    = {inputTabIndex}
        value       = {inputValue}
        />
    ) :
    (
      <input
        id          = {id}
        onChange    = {this.onChange}
        onFocus     = {this.onFocus}
        onBlur      = {this.onBlur}
        onKeyDown   = {this.onKeyDown}
        onKeyUp     = {this.onKeyUp}
        onSelect    = {this.onSelect}
        disabled    = {disabled}
        maxLength   = {this.props.maxLength}
        placeholder = {inputHintText}
        size        = {this.props.size || 'size'}
        style       = {fieldStyle}
        type        = {this.props.type || 'text'}
        key         = 'input'
        tabIndex    = {inputTabIndex}
        value       = {inputValue}
        />
    );

    // Conversion from flying-balloon-anchor to triangle-position.
    const trianglePosition = {
      bottom: 'top',
      top:    'bottom',
      left:   'right',
      right:  'left',
    } [inputFlyingBalloonAnchor];

    let htmlFlyingBalloon = null;
    if (inputMessageWarning || inputMessageInfo) {
      htmlFlyingBalloon = (
        <FlyingBalloon
          primary-text      = {inputMessageWarning}
          secondary-text    = {inputMessageInfo}
          triangle-position = {trianglePosition}
          {...this.link ()} />
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
