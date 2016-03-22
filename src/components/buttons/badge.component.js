'use strict';

import React from 'react';
import {Action} from 'electrum';
import {Badge as MUIBadge} from 'material-ui';
/******************************************************************************/

export default class Badge extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const disabled = Action.isDisabled (this.props.state);
    return (
      <MUIBadge disabled={disabled} onTouchTap={this.onClick} {...this.props}>
        {this.props.children}
      </MUIBadge>
    );
  }
}

/******************************************************************************/
