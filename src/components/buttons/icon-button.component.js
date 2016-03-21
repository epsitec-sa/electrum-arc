'use strict';

import React from 'react';
import {Action} from 'electrum';
import {IconButton as MUIIconButton} from 'material-ui';
import CodeIcon from 'material-ui/lib/svg-icons/action/code';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
/******************************************************************************/

export default class IconButton extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const disabled = Action.isDisabled (this.props.state);
    return (
      <MUIIconButton disabled={disabled} onTouchTap={this.onClick} {...this.props}>
        <NavigationClose />
        {this.props.children}
      </MUIIconButton>
    );
  }
}

/******************************************************************************/
