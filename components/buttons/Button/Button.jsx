'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = E.createClass({

  handleClick: function () {
    //  TODO: dispatch event to Electrum
  },

  render: function () {
    //  TODO: fetch text and style via Electrum
    var text = this.props.id;
    var style = {};
    var disabled = false;

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
