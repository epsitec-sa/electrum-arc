'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = E.createClass({

  handleClick: function (event) {
    E.dispatchAction (this, event, this.props.action || this.props.id);
  },

  render: function () {
    var text = E.getText (this);
    var style = E.getStyle (this);
    var disabled = E.getState (s => s.disabled);

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
