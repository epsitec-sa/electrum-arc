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
    const disabled = Action.isDisabled (this.props.state);
    return (
      <MUIFlatButton disabled={disabled} onTouchTap={this.onClick} {...this.props}>
        {this.props.children}
      </MUIFlatButton>
    );
  }
}

/******************************************************************************/
