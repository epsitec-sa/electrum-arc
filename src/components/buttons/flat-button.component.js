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
        href={this.props.href || this.read ('href')}
        icon={this.props.icon || this.read ('icon')}
        label={this.props.label || this.read ('label')}
        labelPosition={this.props.labelPosition || this.read ('labelPosition')}
        linkButton={this.props.linkButton || this.read ('linkButton')}
        primary={this.props.primary || this.read ('primary')}
        secondary={this.props.secondary || this.read ('secondary')}
        {...this.props}
        >
        {this.props.children}
      </MUIFlatButton>
    );
  }
}

/******************************************************************************/
