'use strict';

import React from 'react';
import {E} from 'electrum';
import {Window, GoogleFontHack as GFH, AppCanvas} from 'electrum-arc';

/*****************************************************************************/

module.exports = {
  displayName: 'App',
  viewers: [],

  addViewer: function (viewer) {
    if (this.viewers.indexOf (viewer) < 0) {
      this.viewers.push (viewer);
    }
  },

  removeViewer: function (viewer) {
    var index = this.viewers.indexOf (viewer);
    if (index > -1) {
      this.viewers.splice (index, 1);
    }
  },

  clearViewers: function () {
    this.viewers = [];
    /*while (this.viewers.length > 0) {
      this.removeViewer (this.viewers[this.viewers.length - 1]);
    }*/
  },

  componentWillMount: function () {},

  renderViewers: function () {
    var self = this;
    return self.viewers.map (function (activity) {
      return (
        <Window navigationMode={activity.display.mode}>{activity.view}</Window>
      );
    });
  },

  render: function () {
    if (this.viewers.length > 0) {
      return (
        <AppCanvas>
          <GFH />
          {this.renderViewers ()}
        </AppCanvas>
      );
    } else {
      return (<div>No view defined</div>);
    }
  }
};

/*****************************************************************************/
