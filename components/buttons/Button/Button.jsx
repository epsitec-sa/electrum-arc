'use strict';

var E          = require ('e');
var React      = require ('react');
/*****************************************************************************/

module.exports = {

  handleClick: function () {
    E.bus.dispatch (this, this.props.action || this.props.id);
  },

  render: function () {
    var style = E.getStyle (this);
    var state = E.getState (this, s => s.disabled);
    console.log ('RENDER:', state);
    return (
      <button style={style}
        disabled={state.disabled}
        onClick={this.handleClick}>
        {this.props.children}
      </button>
    );
  }
};

/*****************************************************************************/
