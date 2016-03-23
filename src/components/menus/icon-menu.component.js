'use strict';

import React from 'react';
import {Action} from 'electrum';
import {IconMenu as MUIIconMenu} from 'material-ui';
/******************************************************************************/

export default class IconMenu extends React.Component {

  constructor (props) {
    super (props);
  }

  onChange (event, value) {
    const {id, state} = this.props;
    console.log (`onChange: ${id}, ${state.generation} value=${event.target.value}`);
  }

  render () {
    const {state} = this.props.state;
    const disabled = Action.isDisabled (state);
    return (
      <MUIIconMenu
        onChange={this.onChange}
        checked={this.props.checked || this.read ('checked')}
        disabled={disabled}
        anchorOrigin={this.props.anchorOrigin || this.read ('anchorOrigin')}
        closeOnItemTouchTap={this.props.closeOnItemTouchTap || this.read ('closeOnItemTouchTap')}
        iconButtonElement={this.props.iconButtonElement || this.read ('iconButtonElement')}
        open={this.props.open || this.read ('open')}
        touchTapCloseDelay={this.props.touchTapCloseDelay || this.read ('touchTapCloseDelay')}
        {...this.props}
        >
        {this.props.children}
      </MUIIconMenu>
    );
  }
}

/******************************************************************************/
