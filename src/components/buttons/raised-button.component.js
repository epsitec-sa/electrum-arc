'use strict';

import React from 'react';
import {Action} from 'electrum';
import {RaisedButton  as MUIRaisedButton } from 'material-ui';
/******************************************************************************/

export default class FlatButton extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state} = this.props.state;
    const disabled = Action.isDisabled (state);
    return (
      <MUIRaisedButton
        onTouchTap={this.onClick}
        disabled={disabled}
        fullWidth={this.props.fullWidth || this.read ('fullWidth')}
        icon={this.props.icon || this.read ('icon')}
        label={this.props.label || this.read ('label')}
        labelPosition={this.props.labelPosition || this.read ('labelPosition')}
        primary={this.props.primary || this.read ('primary')}
        secondary={this.props.secondary || this.read ('secondary')}
        {...this.props}
        >
        {this.props.children}
      </MUIRaisedButton>
    );
  }
}

/******************************************************************************/
