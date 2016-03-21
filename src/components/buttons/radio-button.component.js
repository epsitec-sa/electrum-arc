'use strict';

import React from 'react';
import {Action} from 'electrum';
import {RadioButton as MUIRadioButton} from 'material-ui';
/******************************************************************************/

export default class RadioButton extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const disabled = Action.isDisabled (this.props.state);
    return (
      <MUIRadioButton disabled={disabled} onTouchTap={this.onClick} {...this.props}>
        {this.props.children}
      </MUIRadioButton>
    );
  }
}

/******************************************************************************/
