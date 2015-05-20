'use strict';

var React = require ('react');
var E     = require ('e');

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

    console.log ('Style='+JSON.stringify (style));

    return (
      <button style={style}
        disabled={disabled}
        onClick={this.handleClick}>
        {text}
      </button>
    );
  }
});

/*****************************************************************************/
