'use strict';

var React      = require ('react');
var E          = require ('e');

/*****************************************************************************/

module.exports = {

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
}

/*****************************************************************************/
