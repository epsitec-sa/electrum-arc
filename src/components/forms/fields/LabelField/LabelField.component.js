'use strict';

import React from 'react';
import {E} from 'electrum';

const FlexBox = E.components.FlexBox;
const BasicField = E.components.BasicField;
const Label = E.components.Label;

/*****************************************************************************/

module.exports = {

  render: function () {
    var type = this.props.type || 'text';
    return (
      <div style={this.props.boxstyle}>
        <FlexBox direction='row' align-items='baseline' split={this.props.splitter}>
          <Label {...this.props} />
          <BasicField type={type} {...this.props} />
        </FlexBox>
      </div>
    );
  }
};

/*****************************************************************************/
