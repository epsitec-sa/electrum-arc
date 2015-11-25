'use strict';

import React from 'react';
import {E} from 'electrum';

/*****************************************************************************/

module.exports = {

  theme: require ('./Text.styles.js'),

  render: function () {
    var text     = E.getText (this);
    var style    = E.getStyle (this);
    var value    = E.getValue (this);

    style = style.concat (this.props.boxstyle);

    return (
      <div style={style}>
        {value ? value : text}
        {this.props.children}
      </div>
    );
  }

};

/*****************************************************************************/
