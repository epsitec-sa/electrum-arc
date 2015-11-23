'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = {

  theme: require ('./AppCanvas.styles.js'),

  render: function () {
    var style    = E.getStyle (this);

    return (
      <div style={style}>
        {this.props.children}
      </div>
    );
  }

};

/*****************************************************************************/
