'use strict';

import React from 'react';
import {Action} from 'electrum';
import {Badge as MUIBadge} from 'material-ui';
/******************************************************************************/

export default class MuBadge extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state} = this.props.state;
    const disabled = Action.isDisabled (state);
    return (
      <MUIBadge
        onTouchTap={this.onClick}
        disabled={disabled}
        primary={this.props.primary || this.read ('primary')}
        secondary={this.props.secondary || this.read ('secondary')}
        {...this.props}
        >
        {this.props.children}
      </MUIBadge>
    );
  }
}

/******************************************************************************/
