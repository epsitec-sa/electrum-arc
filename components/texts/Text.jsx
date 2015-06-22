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

    style = style.concat (this.props.boxstyle);
    
    return (
      <div style={style}>
        {value ? value : text}
        {this.props.children}
      </div>
    );
  }

};

/*****************************************************************************/
