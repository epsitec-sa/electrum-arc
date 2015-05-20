'use strict';

var React   = require ('react');
var E       = require ('e');
var Box     = require ('../../../layouts/Box/Box.jsx');
var FlexBox = require ('../../../layouts/FlexBox/FlexBox.jsx');
var BasicField = require ('../BasicField.jsx');
var FieldLabel = require ('../FieldLabel/FieldLabel.jsx');

/*****************************************************************************/

module.exports = E.createClass({

  render: function () {
    return (
      <Box container={this.props.container} boxstyle={this.props.boxstyle}>
        <FlexBox direction="row" align-items="baseline" space={[1,2]}>
          <FieldLabel {...this.props} />
          <BasicField type="password" {...this.props} />
        </FlexBox>
      </Box>
    );
  }
});

/*****************************************************************************/
