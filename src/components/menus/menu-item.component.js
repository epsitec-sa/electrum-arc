'use strict';

import React from 'react';
import {Action} from 'electrum';
import {MenuItem as MUIMenuItem} from 'material-ui';
/******************************************************************************/

export default class MenuItem extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state} = this.props.state;
    const disabled = Action.isDisabled (state);
    return (
      <MUIMenuItem
        onTouchTap={this.onClick}
        disabled={disabled}
        primaryText={this.props.primaryText || this.read ('primaryText')}
        {...this.props}
        >
        {this.props.children}
      </MUIMenuItem>
    );
  }
}

/******************************************************************************/
