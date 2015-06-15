'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = {

  theme: require ('./Link.styles.js'),

  handleClick: function () {
    E.bus.dispatch (this, this.props.href || this.props.id);
  },

  render: function () {
    var text     = E.getText (this);
    var style    = E.getStyle (this);
    var disabled = E.getState (this, s => s.disabled);

    return (
      <div style={this.props.boxstyle}>
        <a
          href={this.props.href}
          style={style}
          onClick={this.handleClick}
          >
          {text}
          {this.props.children}
        </a>
      </div>
    );
  }

};

/*****************************************************************************/
