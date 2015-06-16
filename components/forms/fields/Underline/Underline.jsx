'use strict';

var React     = require ('react');
var E         = require ('e');

/*****************************************************************************/

module.exports = {

  theme: require ('./Underline.styles.js'),

  getDefaultProps: function() {
    return {
      disabled: false
    };
  },

  render: function () {
    var style     = E.getStyle (this);
    return this.props.disabled ? (
      <div style={style}>
        ....................................................................................
      </div>
    ) : (
      <hr style={style}></hr>
    );
  }

};

/*****************************************************************************/
