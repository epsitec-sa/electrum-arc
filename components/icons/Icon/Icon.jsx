'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = E.createClass({

  handleClick: function () {
    var disabled = E.getState (this, s => s.disabled);
    if (!disabled) {
      E.bus.dispatch (this, this.props.action || this.props.id);
    }    
  },

  render: function () {
    var text     = E.getText (this);
    var style    = require ('./Icon.styles.js');
    var disabled = E.getState (this, s => s.disabled);

    return (
      <div style={style.container[this.props.layout]}>
        <i
          className={'fa fa-' + this.props.fa}
          style={style.base}
          onClick={this.handleClick}>
          {text}
          {this.props.children}
        </i>
      </div>
    );
  }
});

/*****************************************************************************/