'use strict';

import React from 'react';
import {E} from 'electrum';

/*****************************************************************************/

module.exports = {

  theme: require ('./Footer.styles.js') (E),

  render: function () {
    var style = E.getStyle (this);

    return (
      <div style={this.props.boxstyle}>
        <footer style={style}>
          {this.props.children}
        </footer>
      </div>
    );
  }

};

/*****************************************************************************/
