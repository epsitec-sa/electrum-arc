'use strict';

import React from 'react';
import {E} from 'electrum';

/*****************************************************************************/

module.exports = {

  theme: require ('./Icon.styles.js'),

  handleClick: function () {
    if (this.props.action || this.props.id) {
      E.bus.dispatch (this, this.props.action || this.props.id);
    }
  },

  render: function () {
    var style    = E.getStyle (this);
    var icon     = this.props.fa || 'star';

    return (
      <div style={this.props.boxstyle}>
        <i
          className={'fa fa-' + icon}
          style={style}
          onClick={this.handleClick}>
          {this.props.children}
        </i>&nbsp;
      </div>
    );
  }

};

/*****************************************************************************/
