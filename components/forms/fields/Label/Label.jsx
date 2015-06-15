'use strict';

var React     = require ('react');
var E         = require ('e');

/*****************************************************************************/

module.exports = {

  theme: require ('./Label.styles.js'),

  render: function () {

    var labelText = E.getText (this);
    var style     = E.getStyle (this);

    return (
      <div style={this.props.boxstyle}>
        <label htmlFor={this.props.id} style={style}>
          {labelText}
          {this.props.children}
        </label>
      </div>
    );
  }

};

/*****************************************************************************/
