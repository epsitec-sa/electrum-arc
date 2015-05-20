'use strict';

var React = require ('react');
var E     = require ('e');
var Box   = require ('../../layouts/Box/Box.jsx');

/*****************************************************************************/

module.exports = E.createClass({

  render: function () {
    var text = E.getText (this);
    var style = E.getStyle (this);
    var disabled = E.getState (this, s => s.disabled);

    return (
      <Box container={this.props.container} boxstyle={this.props.boxstyle}>
        <header style={style}>
          {this.props.children}
        </header>
      </Box>
    );
  }
});

/*****************************************************************************/
