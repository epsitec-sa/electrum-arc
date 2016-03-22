'use strict';

import React from 'react';
import {Action} from 'electrum';
import {TextField as MUITextField} from 'material-ui';
/******************************************************************************/

export default class TextField extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const disabled = Action.isDisabled (this.props.state);
    return (
      <MUITextField disabled={disabled} onTouchTap={this.onClick} {...this.props}>
        {this.props.children}
      </MUITextField>
    );
  }
}

/******************************************************************************/
