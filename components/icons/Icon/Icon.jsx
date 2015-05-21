'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = E.createClass ('Icon', {

  theme: require ('./Icon.styles.js'),

  handleClick: function () {
    var disabled = E.getState (this, s => s.disabled);
    if (!disabled) {
      E.bus.dispatch (this, this.props.action || this.props.id);
    }
  },

  render: function () {
    var text     = E.getText (this);
    var style    = E.getStyle (this);
    var disabled = E.getState (this, s => s.disabled);
    var icon = this.props.fa || 'star';
    return (
      <div style={this.props.boxstyle}>
        <i
          className={'fa fa-' + icon}
          style={style}
          onClick={this.handleClick}>
          {text}
          {this.props.children}
        </i>
      </div>
    );
  }
});

/*****************************************************************************/
