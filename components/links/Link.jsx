'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = {

  theme: require ('./Link.styles.js'),

  render: function () {
    var style = E.getStyle (this);

    return (
      <div style={this.props.boxstyle}>
        <a href={this.props.href} style={style}>
          {this.props.children}
        </a>
      </div>
    );
  }

};

/*****************************************************************************/
