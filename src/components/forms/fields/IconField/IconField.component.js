'use strict';

import React from 'react';
import {E} from 'electrum';

const FlexBox = E.components.FlexBox;
const BasicField = E.components.BasicField;
const Icon = E.components.Icon;

/*****************************************************************************/

module.exports = {

  render: function () {
    var fieldType  = this.props.type || 'text';

    return (
      <div style={this.props.boxstyle}>
        <FlexBox direction='row' align-items='baseline' kind='field'>
          <Icon kind='iconfield' fa={this.props.icon} />
          <BasicField
            id={this.props.id}
            kind='iconfield'
            type={fieldType}
            {...this.props} />
        </FlexBox>
      </div>
    );
  }

};

/*****************************************************************************/
