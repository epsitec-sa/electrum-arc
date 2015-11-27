'use strict';

import React from 'react';
import {E} from 'electrum';

const TransitionChild = E.components.VelocityTransitionChild;

/*****************************************************************************/

module.exports = {

  propTypes: {
    transition: React.PropTypes.string
  },

  _wrapChild: function (child) {
    return (
      <TransitionChild transition={this.props.transition}>
        {child}
      </TransitionChild>
    );
  },

  render: function () {
    var ReactTransitionGroup = React.addons.TransitionGroup;
    return (
      <ReactTransitionGroup
        {...this.props}
        childFactory={this._wrapChild}
      />
    );
  }

};

/*****************************************************************************/
