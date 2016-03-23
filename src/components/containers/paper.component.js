'use strict';

import React from 'react';
import {Action} from 'electrum';
import {Paper as MUIPaper} from 'material-ui';
/******************************************************************************/

export default class Paper extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state} = this.props.state;
    const disabled = Action.isDisabled (state);
    return (
      <MUIPaper
        onTouchTap={this.onClick}
        disabled={disabled}
        circle={this.props.circle || this.read ('circle')}
        rounded={this.props.rounded || this.read ('rounded')}
        transitionEnabled={this.props.transitionEnabled || this.read ('transitionEnabled')}
        zDepth={this.props.zDepth || this.read ('zDepth')}
        {...this.props}
        >
        {this.props.children}
      </MUIPaper>
    );
  }
}

/******************************************************************************/
