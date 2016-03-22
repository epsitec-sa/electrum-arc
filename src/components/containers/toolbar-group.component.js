'use strict';

import React from 'react';
import {Action} from 'electrum';
import {ToolbarGroup as MUIToolbarGroup} from 'material-ui';
/******************************************************************************/

export default class ToolbarGroup extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state} = this.props.state;
    const disabled = Action.isDisabled (state);
    return (
      <MUIToolbarGroup
        onTouchTap={this.onClick}
        disabled={disabled}
        {...this.props}
        >
        {this.props.children}
      </MUIToolbarGroup>
    );
  }
}

/******************************************************************************/
