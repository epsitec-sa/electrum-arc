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
    const {state} = this.props.state;
    const disabled = Action.isDisabled (state);
    return (
      <MUIRadioButton
        onTouchTap={this.onClick}
        id={this.props.id}
        checked={this.props.checked || this.read ('checked')}
        labelPosition={this.props.labelPosition || this.read ('labelPosition')}
        disabled={disabled}
        {...this.props}
        >
        {this.props.children}
      </MUIRadioButton>
    );
  }
}

/******************************************************************************/
