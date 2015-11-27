'use strict';

import React from 'react';
import {E} from 'electrum';
import {Link} from 'electrum-arc';

/*****************************************************************************/

module.exports = {

  theme: require ('./Menu.styles.js'),

  headingBoxStyle: {
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    display: 'inline-block',
    zoom: 1,
    verticalAlign: 'middle',
    padding: 0,
    margin: 0
  },

  itemBoxStyle: {
    display: 'inline-block',
    zoom: 1,
    verticalAlign: 'middle',
    padding: 0,
    margin: 0
  },

  render: function () {
    var style  = E.getStyle (this);
    var zIndex = this.props['z-index'] || 1;
    style.push ({
      zIndex: zIndex
    });
    var self      = this;
    var _setMenuItem = function (item) {
      if (typeof item.type === 'function') {
        return React.addons.cloneWithProps (item, {
          kind: 'menu-item',
          boxstyle: self.itemBoxStyle
        });
      } else {
        // Native html comp.
        return item;
      }
    };
    var menuItems = React.Children.map (this.props.children, _setMenuItem);
    return (
      <nav style={style}>
        <Link boxstyle={this.headingBoxStyle} kind='menu-heading'>
          {this.props.title}
        </Link>
        {menuItems}
      </nav>
    );
  }

};

/*****************************************************************************/
