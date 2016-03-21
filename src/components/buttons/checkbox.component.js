'use strict';

import React from 'react';
import {Action} from 'electrum';
import {Checkbox as MUICheckbox} from 'material-ui';
/******************************************************************************/

export default class Checkbox extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const disabled = Action.isDisabled (this.props.state);
    return (
      <MUICheckbox disabled={disabled} onTouchTap={this.onClick} {...this.props}>
        {this.props.children}
      </MUICheckbox>
    );
  }
}

/******************************************************************************/
