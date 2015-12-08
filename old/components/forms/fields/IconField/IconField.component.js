'use strict';

import React from 'react';
import {E} from 'electrum';
import {FlexBox, BasicField, Icon} from 'electrum-arc';

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
