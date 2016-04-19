'use strict';

import React from 'react';
import {Action} from 'electrum';
import {ToolbarSeparator as MUIToolbarSeparator} from 'material-ui';
/******************************************************************************/

export default class MuToolbarSeparator extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state} = this.props.state;
    const disabled = Action.isDisabled (state);
    return (
      <MUIToolbarSeparator
        onTouchTap={this.onClick}
        disabled={disabled}
        {...this.props}
        >
        {this.props.children}
      </MUIToolbarSeparator>
    );
  }
}

/******************************************************************************/
