'use strict';

import React from 'react';
import {E} from 'electrum';

/*****************************************************************************/

module.exports = {

  theme: require ('./Underline.styles.js') (E),

  getDefaultProps: function () {
    return {
      disabled: false
    };
  },

  render: function () {
    var style     = E.getStyle (this);
    return this.props.disabled ? (
      <div style={style}>
        ....................................................................................
      </div>
    ) : (
      <hr style={style}></hr>
    );
  }

};

/*****************************************************************************/
