'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = {

  theme: require ('./Overlay.styles.js'),

  handleClick: function(e) {
    e.stopPropagation();
  },

  render: function () {
    var text = E.getText (this);
    var style = E.getStyle (this);
    var disabled = E.getState (this, s => s.disabled);
    var zIndex   = this.props['z-index'] || 1;

    style.push ({
      zIndex: zIndex
    });

    return (
      <div style={style} onClick={this.handleClick}>
      </div>
    );
  }
}

/*****************************************************************************/
