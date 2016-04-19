'use strict';

import React from 'react';
import {Action} from 'electrum';
import {Checkbox as MUICheckbox} from 'material-ui';
/******************************************************************************/

export default class MuCheckbox extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state} = this.props.state;
    const disabled = Action.isDisabled (state);
    return (
      <MUICheckbox
        onTouchTap={this.onClick}
        id={this.props.id}
        checked={this.props.checked || this.read ('checked')}
        label={this.props.label || this.read ('label')}
        labelPosition={this.props.labelPosition || this.read ('labelPosition')}
        disabled={disabled}
        {...this.props}
        >
        {this.props.children}
      </MUICheckbox>
    );
  }
}

/******************************************************************************/
