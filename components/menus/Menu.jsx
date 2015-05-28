'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = {

  theme: require ('./Menu.styles.js'),

  headingStyle: {
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    display: 'inline-block',
    zoom: 1,
    verticalAlign: 'middle',
    padding: 0,
    margin: 0
  },

  itemStyle: {
    display: 'inline-block',
    zoom: 1,
    verticalAlign: 'middle',
    padding: 0,
    margin: 0
  },

  render: function () {
    var Link = require ('arc').Link;
    var text = E.getText (this);
    var style = E.getStyle (this);
    var disabled = E.getState (this, s => s.disabled);
    var zIndex   = this.props['z-index'] || 1;
    style.push ({
      zIndex: zIndex
    });
    var self      = this;
    var _setMenuItem = function (item, index) {
      if (typeof item.type === 'function') {
        return React.addons.cloneWithProps(item, {
          kind: 'menu-item',
          boxstyle: self.itemStyle
        });
      } else {
        // Native html comp.
        return item;
      }
    };
    var menuItems = React.Children.map (this.props.children, _setMenuItem);
    return (
      <nav style={style}>
        <Link boxstyle={this.headingStyle} kind="menu-heading">
          {this.props.title}
        </Link>
        {menuItems}
      </nav>
    );
  }
}

/*****************************************************************************/
