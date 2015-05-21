'use strict';

var React   = require ('react');
var E       = require ('e');
var FlexBox = require ('../../../layouts/FlexBox/FlexBox.jsx');
var BasicField = require ('../BasicField.jsx');
var Label = require ('../Label/Label.jsx');

/*****************************************************************************/

module.exports = E.createClass ('LabelField', {

  render: function () {
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
});

/*****************************************************************************/
