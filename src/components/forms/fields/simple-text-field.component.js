'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {Action} from 'electrum';
import {FlyingBalloon} from '../../../all-components.js';

/******************************************************************************/

export default class SimpleTextField extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      value: ''
    };
  }

  getValue () {
    return this.state.value;
  }

  setValue (value) {
    this.setState ( {
      value: value
    });
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
      readonly:       this.read ('readonly'),
    };
  }

  componentWillMount () {
    console.log ('SimpleTextField.componentWillMount');
    const updateStrategy = this.read ('updateStrategy');
    if (updateStrategy === 'every-time' || updateStrategy === 'when-blur') {
      const value = this.read ('value');
      this.setValue (value);
    }
  }

  componentDidMount () {
    console.log ('SimpleTextField.componentDidMount');
    const autofocus = this.read ('autofocus');
    if (autofocus) {
      const node = ReactDOM.findDOMNode (this);
      // Set focus to child <input>, asynchronously.
      setTimeout (() => {
        node.children[0].focus ();
        node.children[0].select ();
      }, 0);
    }
  }

  onMyChange (e) {
    // console.log ('SimpleTextField.onMyChange');
    this.onChange (e);
    const onChange = this.read ('onChange');
    if (onChange) {
      this.setValue (e.target.value);
      const updateStrategy = this.read ('updateStrategy');
      if (updateStrategy === 'every-time') {
        onChange (e);
      }
    }
  }

  onMyFocus (e) {
    this.onFocus (e);
    const onFocus = this.read ('onFocus');
    if (onFocus) {
      onFocus (e);
    }
  }

  onMyBlur (e) {
    this.onBlur (e);
    const onChange = this.read ('onChange');
    if (onChange) {
      const updateStrategy = this.read ('updateStrategy');
      if (updateStrategy === 'when-blur') {
        onChange (e);
      }
    }
    const onBlur = this.read ('onBlur');
    if (onBlur) {
      onBlur (e);
    }
  }

  renderInput () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);
    const id             = this.read ('id');
    const value          = this.read ('value');
    const updateStrategy = this.read ('updateStrategy');
    const hintText       = this.read ('hint-text');
    const rows           = this.read ('rows');
    const tabIndex       = this.props['tab-index'];

    const editedValue = (updateStrategy === 'every-time' || updateStrategy === 'when-blur') ?
      this.getValue () : value;

    if (rows) {
      const textareaStyle = this.mergeStyles ('textarea');
      return (
        <textarea
          id          = {id}
          style       = {textareaStyle}
          onChange    = {e => this.onMyChange (e)}
          onFocus     = {e => this.onMyFocus (e)}
          onBlur      = {e => this.onMyBlur (e)}
          onKeyDown   = {this.onKeyDown}
          onKeyUp     = {this.onKeyUp}
          onSelect    = {this.onSelect}
          disabled    = {disabled}
          rows        = {rows}
          tabIndex    = {tabIndex}
          value       = {editedValue}
          />
      );
    } else {
      const fieldStyle = this.mergeStyles ('field');
      return (
        <input
          id          = {id}
          onChange    = {e => this.onMyChange (e)}
          onFocus     = {e => this.onMyFocus (e)}
          onBlur      = {e => this.onMyBlur (e)}
          onKeyDown   = {this.onKeyDown}
          onKeyUp     = {this.onKeyUp}
          onSelect    = {this.onSelect}
          disabled    = {disabled}
          maxLength   = {this.props.maxLength}
          placeholder = {hintText}
          size        = {this.props.size || 'size'}
          style       = {fieldStyle}
          type        = {this.props.type || 'text'}
          key         = 'input'
          tabIndex    = {tabIndex}
          value       = {editedValue}
          />
      );
    }
  }

  renderFlyingBalloon () {
    const messageWarning      = this.read ('message-warning');
    const messageInfo         = this.read ('message-info');
    const flyingBalloonAnchor = this.read ('flying-balloon-anchor');
    // Conversion from flying-balloon-anchor to triangle-position.
    const trianglePosition = {
      bottom: 'top',
      top:    'bottom',
      left:   'right',
      right:  'left',
    } [flyingBalloonAnchor];

    if (messageWarning || messageInfo) {
      return (
        <FlyingBalloon
          primary-text      = {messageWarning}
          secondary-text    = {messageInfo}
          triangle-position = {trianglePosition}
          {...this.link ()} />
      );
    } else {
      return null;
    }
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);

    const boxStyle = this.mergeStyles ('box');

    return (
     <span
       disabled = {disabled}
       style    = {boxStyle}
       >
       {this.renderInput ()}
       {this.renderFlyingBalloon ()}
     </span>
    );
  }
}

/******************************************************************************/
