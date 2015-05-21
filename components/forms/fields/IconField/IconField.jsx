'use strict';

var React      = require ('react');
var E          = require ('e');
var BasicField = require ('../BasicField.jsx');
var Icon       = require ('../../../icons/Icon/Icon.jsx');

/*****************************************************************************/

module.exports = E.createClass ('IconField', {

  render: function () {
    var type = this.props.type || 'text';
    return (
      <div style={this.props.boxstyle}>
        <Icon fa={this.props.icon} />
        <BasicField type={type} {...this.props} />
      </div>
    );
  }
});

/*****************************************************************************/
