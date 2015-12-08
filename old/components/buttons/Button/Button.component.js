'use strict';

import React from 'react';
import {E} from 'electrum';

/*****************************************************************************/

module.exports = {

  theme: require ('./Button.styles.js') (E),

  handleClick: function () {
    if (this.props.action || this.props.id) {
      E.bus.dispatch (this, this.props.action || this.props.id);
    }
  },

  render: function () {
    var text     = E.getText (this);
    var style    = E.getStyle (this);
    var disabled = E.getState (this, s => s.disabled);
    if (disabled) {
      style.push ({
        color: E.palette.disabledColor
      });
    }
    return (
      <div style={this.props.boxstyle}>
        <button
          style={style}
          disabled={disabled}
          onClick={this.handleClick}
        >
          {text}
        </button>
      </div>
    );
  }
};

/*****************************************************************************/
