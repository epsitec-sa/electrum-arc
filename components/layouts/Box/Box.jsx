'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = E.createClass({

  render: function () {
    var text      = E.getText (this);
    var style     = require ('./Box.styles.js');
    var disabled  = E.getState (this, s => s.disabled);
    var container = this.props.container || 'base';
    var boxstyle  = this.props.boxstyle || {};
    return (
      <div style={[style[container], boxstyle]}>
        {this.props.children}
      </div>
    );
  }
});

/*****************************************************************************/
