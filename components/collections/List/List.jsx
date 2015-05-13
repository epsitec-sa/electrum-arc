'use strict';

var E          = require ('e');
var React      = require ('react');
/*****************************************************************************/

module.exports = {

  render: function () {
    var style    = E.getStyle (this);
    var state    = E.getState (this, s => s.disabled);
    var iterator = E.getValue (this);
    return (
      <ul style={style}>
        {iterator}
        {this.props.children}
      </ul>
    );
  }
};
