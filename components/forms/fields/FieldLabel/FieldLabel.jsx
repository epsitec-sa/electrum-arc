'use strict';

var React     = require ('react');
var E         = require ('e');

/*****************************************************************************/

module.exports = E.createClass({

  render: function () {

    var labelText = E.getText (this);
    var style     = require ('./FieldLabel.styles.js');
    var disabled  = E.getState (this, s => s.disabled);
    return (
      <div style={this.props.boxstyle}>
        <label htmlFor={this.props.id} style={style.base}>
          {labelText}
          {this.props.children}
        </label>
      </div>
    );
  }
});

/*****************************************************************************/
