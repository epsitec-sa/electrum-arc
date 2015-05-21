'use strict';

var React   = require ('react');
var E       = require ('e');
var FlexBox = require ('../../../layouts/FlexBox/FlexBox.jsx');
var BasicField = require ('../BasicField.jsx');
var FieldLabel = require ('../FieldLabel/FieldLabel.jsx');

/*****************************************************************************/

module.exports = E.createClass({

  render: function () {
    return (
      <div style={this.props.boxstyle}>
        <FlexBox direction="row" align-items="baseline" split={this.props.splitter}>
          <FieldLabel id={this.props.id} />
          <BasicField id={this.props.id} type="password" />
        </FlexBox>
      </div>
    );
  }
});

/*****************************************************************************/
