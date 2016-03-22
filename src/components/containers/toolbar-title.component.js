'use strict';

import React from 'react';
import {Action} from 'electrum';
import {ToolbarTitle as MUIToolbarTitle} from 'material-ui';
/******************************************************************************/

export default class ToolbarTitle extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state} = this.props.state;
    const disabled = Action.isDisabled (state);
    return (
      <MUIToolbarTitle
        onTouchTap={this.onClick}
        disabled={disabled}
        {...this.props}
        >
        {this.props.children}
      </MUIToolbarTitle>
    );
  }
}

/******************************************************************************/
