'use strict';

var React   = require ('react');

/*****************************************************************************/

module.exports = {

  render: function () {
    var FlexBox    = require ('arc').FlexBox;
    var BasicField = require ('arc').BasicField;
    var Label      = require ('arc').Label;
    var type = this.props.type || 'text';
    return (
      <div style={this.props.boxstyle}>
        <FlexBox direction="row" align-items="baseline" split={this.props.splitter}>
          <Label {...this.props} />
          <BasicField type={type} {...this.props} />
        </FlexBox>
      </div>
    );
  }
};

/*****************************************************************************/
