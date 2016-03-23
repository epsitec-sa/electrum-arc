'use strict';

import React from 'react';
import {Action} from 'electrum';
import {IconButton as MUIIconButton} from 'material-ui';
/******************************************************************************/

export default class IconButton extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state} = this.props.state;
    const disabled = Action.isDisabled (state);
    const awesome = this.props.awesome || this.read ('awesome');

    if (awesome) {
      return (
        <label>Font Awesome</label>
      );
    } else {
      return (
        <MUIIconButton
          onTouchTap={this.onClick}
          disabled={disabled}
          tooltip={this.props.tooltip || this.read ('tooltip')}
          {...this.props}
          >
          {this.props.children}
        </MUIIconButton>
      );
    }
  }
}

/******************************************************************************/
