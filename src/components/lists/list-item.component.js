'use strict';

import React from 'react';
import {Action} from 'electrum';
import {ListItem as MUIListItem} from 'material-ui';

/******************************************************************************/

export default class ListItem extends React.Component {

  render () {
    const disabled = Action.isDisabled (this.props.state);
    return (
      <MUIListItem disabled={disabled} onTouchTap={this.onClick} {...this.props}>
        {this.props.children}
      </MUIListItem>
    );
  }
}
