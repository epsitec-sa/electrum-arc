'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = {

  theme: require ('./Footer.styles.js'),

  render: function () {
    var style = E.getStyle (this);

    return (
      <div style={this.props.boxstyle}>
        <footer style={style}>
          {this.props.children}
        </footer>
      </div>
    );
  }

};

/*****************************************************************************/
