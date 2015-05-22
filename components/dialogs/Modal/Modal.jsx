'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = {

  render: function () {
    var text = E.getText (this);
    var style = E.getStyle (this);
    var disabled = E.getState (this, s => s.disabled);

    return (
      <div style={this.props.boxstyle}>
        <div style={style}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

/*****************************************************************************/
