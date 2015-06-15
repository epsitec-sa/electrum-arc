'use strict';

var React = require ('react');
var E     = require ('e');

/*****************************************************************************/

module.exports = {

  theme: require ('./Icon.styles.js'),

  render: function () {
    var text     = E.getText (this);
    var style    = E.getStyle (this);
    var icon     = this.props.fa || 'star';

    return (
      <div style={this.props.boxstyle}>
        <i
          className={'fa fa-' + icon}
          style={style}
          onClick={this.props.onClick}>
          {text}
          {this.props.children}
        </i>
      </div>
    );
  }

};

/*****************************************************************************/
