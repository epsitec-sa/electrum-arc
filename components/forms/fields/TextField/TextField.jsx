'use strict';

var React   = require ('react');
var E       = require ('e');
var FlexBox = require ('../../../layouts/FlexBox/FlexBox.jsx');
var BasicField = require ('../BasicField.jsx');
var FieldLabel = require ('../FieldLabel/FieldLabel.jsx');

/*****************************************************************************/

module.exports = E.createClass ('TextField', {

  render: function () {
    return (
      <div style={this.props.boxstyle}>
        <FlexBox direction="row" align-items="baseline" split={this.props.splitter}>
          <FieldLabel {...this.props} />
          <BasicField type="text" {...this.props} />
        </FlexBox>
      </div>
    );
  }
});

/*****************************************************************************/
