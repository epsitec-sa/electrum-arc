'use strict';

import React from 'react';
import {E} from 'electrum';

/*****************************************************************************/

module.exports = {

  theme: require ('./AppCanvas.styles.js'),

  render: function () {
    var style    = E.getStyle (this);

    return (
      <div style={style}>
        {this.props.children}
      </div>
    );
  }

};

/*****************************************************************************/
