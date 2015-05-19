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
      <div style={style.container[this.props.layout]}>
        <label for={this.props.id} style={style}>
          {labelText}
          {this.props.children}
        </label>
      </div>
    );
  }
});

/*****************************************************************************/
