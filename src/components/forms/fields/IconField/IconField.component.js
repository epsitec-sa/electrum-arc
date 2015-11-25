'use strict';

import React from 'react';
// import {E} from 'electrum';

/*****************************************************************************/

module.exports = {

  render: function () {
    var FlexBox    = require ('arc').FlexBox;
    var BasicField = require ('arc').BasicField;
    var Icon       = require ('arc').Icon;
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
