'use strict';

import React from 'react';
import {Action} from 'electrum';
import {FloatingActionButton as MUIFloatingActionButton} from 'material-ui';
/******************************************************************************/

export default class FloatingActionButton extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state} = this.props.state;
    const disabled = Action.isDisabled (state);
    return (
      <MUIFloatingActionButton
        onTouchTap={this.onClick}
        disabled={disabled}
        href={this.props.href || this.read ('href')}
        icon={this.props.icon || this.read ('icon')}
        label={this.props.label || this.read ('label')}
        linkButton={this.props.linkButton || this.read ('linkButton')}
        mini={this.props.mini || this.read ('mini')}
        secondary={this.props.secondary || this.read ('secondary')}
        {...this.props}
        >
        {this.props.children}
      </MUIFloatingActionButton>
    );
  }
}

/******************************************************************************/
