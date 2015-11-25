'use strict';

import React from 'react';
import {E} from 'electrum';

/*****************************************************************************/

module.exports = {

  theme: require ('./BasicField.styles.js'),

  getDefaultProps: function () {
    return {
      fullWidth: false,
      type: 'text',
      rows: 1,
    };
  },

  getContainerStyles: function () {
    return [{
      fontSize: 16,
      lineHeight: '24px',
      width: this.props.fullWidth ? '100%' : 256,
      height: (this.props.rows - 1) * 24 + (this.props.floatingLabelText ? 72 : 48),
      display: 'inline-block',
      position: 'relative',
      fontFamily: E.typo.font,
    }];
  },

  isFocused: function () {
    return !!(
      this.state &&
      this.state._radiumStyleState &&
      this.state._radiumStyleState.input &&
      this.state._radiumStyleState.input[':focus']
    ) || false;
  },

  render: function () {
    var A             = require ('arc');
    var Underline     = A.Underline;
    var eventHandlers = A.eventHandlers;
    var placeholder   = this.props.placeholder || '...';
    var style     = E.getStyle (this);
    var value     = E.getValue (this);
    var disabled  = E.getState (this, s => s.disabled);
    var fieldType = this.props.type;
    var underLineKind = 'base';
    if (disabled) {
      underLineKind = 'disabled';
    } else if (this.isFocused ()) {
      underLineKind = 'focus';
    }
    return (
      <div style={this.props.boxstyle}>
        <div style={this.getContainerStyles ()}>
          <input
            onChange={ev => eventHandlers.handleChange (this, ev)}
            onFocus={ev => eventHandlers.handleFocus (this, ev)}
            onKeyDown={ev => eventHandlers.handleKeyDown (this, ev)}
            onKeyUp={ev => eventHandlers.handleKeyUp (this, ev)}
            onSelect={ev => eventHandlers.handleSelect (this, ev)}
            style={style}
            type={fieldType}
            id={this.props.id}
            key='input'
            placeholder={placeholder}
            disabled={disabled}
            value={value}
            maxLength={this.props['max-length']}>
          </input>
          <Underline kind={underLineKind} />
        </div>
      </div>
    );
  }

};

/*****************************************************************************/
