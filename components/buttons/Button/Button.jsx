'use strict';

var React = require ('react/addons');
var E     = require ('e');

/*****************************************************************************/

module.exports = {

  theme: require ('./Button.styles.js'),

  handleClick: function () {
    E.bus.dispatch (this, this.props.action || this.props.id);
  },

  render: function () {
    var text = E.getText (this);
    var style = E.getStyle (this);
    var disabled = E.getState (this, s => s.disabled);
    var Transition = React.addons.TransitionGroup;

    return (
      <Transition component="div" style={this.props.boxstyle}>
        <button
          style={style}
          disabled={disabled}
          onClick={this.handleClick}>
          {text}
        </button>
      </Transition>

    );
  }
}

/*****************************************************************************/
