'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = {

  theme: require ('./Panel.styles.js'),

  render: function () {
    var text     = E.getText (this);
    var style    = E.getStyle (this);
    var disabled = E.getState (this, s => s.disabled);
    var zIndex   = this.props['z-index'] || 0;
    style.push ({
      zIndex: zIndex
    });
    return (
      <div style={style}>
        {this.props.children}
      </div>
    );
  }
}

/*****************************************************************************/
