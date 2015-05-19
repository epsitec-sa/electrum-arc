'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = E.createClass({

  render: function () {
    var text      = E.getText (this);
    var style     = require ('./FlexBox.styles.js');
    var disabled  = E.getState (this, s => s.disabled);
    return (
      <div style={[
           style.base,
           style.direction[this.props.direction],
           style.wrap[this.props.wrap],
           style.justify[this.props.justify]
      ]}>
        {this.props.children}
      </div>
    );
  }
});

/*****************************************************************************/
