'use strict';

var React      = require ('react');
var E          = require ('e');
var BasicField = require ('../BasicField.jsx');
var Icon       = require ('../../../icons/Icon/Icon.jsx');

/*****************************************************************************/

module.exports = E.createClass ('IconField', {

  render: function () {
    var fieldType = this.props.type || 'text';
    var style     = E.getStyle (this);

    return (
      <div style={this.props.boxstyle}>
        <FlexBox direction="row" align-items="baseline" kind="field">
          <Icon kind="iconfield" fa={this.props.icon} />
          <BasicField id={this.props.id} kind="iconfield" type={fieldType} />
        </FlexBox>
      </div>
    );
  }
});

/*****************************************************************************/
