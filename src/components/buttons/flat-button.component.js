'use strict';

import React from 'react';
import {Action} from 'electrum';
import {FlatButton as MUIFlatButton} from 'material-ui';
/******************************************************************************/

export default class FlatButton extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state} = this.props.state;
    const disabled = Action.isDisabled (state);
    return (
      <MUIFlatButton
        onTouchTap={this.onClick}
        disabled={disabled}
        {...this.props}
        >
        {this.props.children}
      </MUIFlatButton>
    );
  }
}

/******************************************************************************/
