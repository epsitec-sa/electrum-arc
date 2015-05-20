'use strict';

var React = require ('react');
var E     = require ('e');
var Box   = require ('../../layouts/Box/Box.jsx');

/*****************************************************************************/

module.exports = E.createClass({

  theme: require ('./Button.styles.js'),

  handleClick: function () {
    E.bus.dispatch (this, this.props.action || this.props.id);
  },

  render: function () {
    var text = E.getText (this);
    var style = E.getStyle (this);
    var disabled = E.getState (this, s => s.disabled);

    return (
      <Box container={this.props.container} boxstyle={this.props.boxstyle}>
        <button style={style}
          disabled={disabled}
          onClick={this.handleClick}>
          {text}
        </button>
      </Box>

    );
  }
});

/*****************************************************************************/
