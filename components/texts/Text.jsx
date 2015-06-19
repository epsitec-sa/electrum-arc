'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = {

  theme: require ('./Text.styles.js'),

  render: function () {
    var text     = E.getText (this);
    var style    = E.getStyle (this);
    var value    = E.getValue (this);

    return (
      <div style={this.props.boxstyle}>
        <p
          style={style}>
          {value ? value : text}
          {this.props.children}
        </p>
      </div>
    );
  }

};

/*****************************************************************************/
