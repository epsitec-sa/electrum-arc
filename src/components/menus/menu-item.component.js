'use strict';

import React from 'react';
import {Action} from 'electrum';
import {MenuItem as MUIMenuItem} from 'material-ui';
/******************************************************************************/

export default class MenuItem extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state} = this.props.state;
    const disabled = Action.isDisabled (state);
    return (
      <MUIMenuItem
        onTouchTap={this.onClick}
        checked={this.props.checked || this.read ('checked')}
        disabled={disabled}
        insetChildren={this.props.insetChildren || this.read ('insetChildren')}
        leftIcon={this.props.leftIcon || this.read ('leftIcon')}
        primaryText={this.props.primaryText || this.read ('primaryText')}
        rightIcon={this.props.rightIcon || this.read ('rightIcon')}
        secondaryText={this.props.secondaryText || this.read ('secondaryText')}
        {...this.props}
        >
        {this.props.children}
      </MUIMenuItem>
    );
  }
}

/******************************************************************************/
