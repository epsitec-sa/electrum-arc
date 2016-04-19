'use strict';

import React from 'react';
import {Action} from 'electrum';
import {Divider as MUIDivider} from 'material-ui';
/******************************************************************************/

export default class MuDivider extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state} = this.props.state;
    const disabled = Action.isDisabled (state);
    return (
      <MUIDivider
        onTouchTap={this.onClick}
        disabled={disabled}
        {...this.props}
        >
        {this.props.children}
      </MUIDivider>
    );
  }
}

/******************************************************************************/
