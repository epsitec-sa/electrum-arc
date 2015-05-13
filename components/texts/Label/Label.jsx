'use strict';

var E          = require ('e');
var React      = require ('react');
/*****************************************************************************/

module.exports = {

  render: function () {
    var text  = E.getText (this);
    var style = E.getStyle (this);
    // var disabled = E.getState (this, s => s.disabled);

    return (
      <label style={style}>
        {text}
        {this.props.children}
      </label>
    );
  }
};

/*****************************************************************************/
