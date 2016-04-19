'use strict';

import React from 'react';
import {Action} from 'electrum';
import {Toolbar as MUIToolbar} from 'material-ui';
/******************************************************************************/

export default class MuToolbar extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state} = this.props.state;
    const disabled = Action.isDisabled (state);
    return (
      <MUIToolbar
        onTouchTap={this.onClick}
        disabled={disabled}
        {...this.props}
        >
        {this.props.children}
      </MUIToolbar>
    );
  }
}

/******************************************************************************/
