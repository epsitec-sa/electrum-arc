'use strict';

var React     = require ('react');
var E         = require ('e');
var Box   = require ('../../../layouts/Box/Box.jsx');

/*****************************************************************************/

module.exports = E.createClass({

  render: function () {

    var labelText = E.getText (this);
    var style     = require ('./FieldLabel.styles.js');
    var disabled  = E.getState (this, s => s.disabled);
    return (
      <Box container={this.props.container} boxstyle={this.props.boxstyle}>
        <label htmlFor={this.props.id} style={style.base}>
          {labelText}
          {this.props.children}
        </label>
      </Box>
    );
  }
});

/*****************************************************************************/
