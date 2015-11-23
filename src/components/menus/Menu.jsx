'use strict';

var React = require ('react/addons');
var E     = require ('e');

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
    var Link   = require ('arc').Link;
    var style  = E.getStyle (this);
    var zIndex = this.props['z-index'] || 1;
    style.push ({
      zIndex: zIndex
    });
    var self      = this;
    var _setMenuItem = function (item) {
      if (typeof item.type === 'function') {
        return React.addons.cloneWithProps(item, {
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
        <Link boxstyle={this.headingBoxStyle} kind="menu-heading">
          {this.props.title}
        </Link>
        {menuItems}
      </nav>
    );
  }

};

/*****************************************************************************/
