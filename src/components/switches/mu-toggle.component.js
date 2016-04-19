'use strict';

import React from 'react';
import {Action} from 'electrum';
import {Toggle as MUIToggle} from 'material-ui';
/******************************************************************************/

export default class MuToggle extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state} = this.props.state;
    const disabled = Action.isDisabled (state);
    return (
      <MUIToggle
        onTouchTap={this.onClick}
        id={this.props.id}
        disabled={disabled}
        label={this.props.label || this.read ('label')}
        labelPosition={this.props.labelPosition || this.read ('labelPosition')}
        toggled={this.props.toggled || this.read ('toggled')}
        {...this.props}
        >
        {this.props.children}
      </MUIToggle>
    );
  }
}

/******************************************************************************/
