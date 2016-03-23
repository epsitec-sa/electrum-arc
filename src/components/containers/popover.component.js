'use strict';

import React from 'react';
import {Action} from 'electrum';
import {Popover as MUIPopover} from 'material-ui';
/******************************************************************************/

export default class Popover extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state} = this.props.state;
    const disabled = Action.isDisabled (state);
    return (
      <MUIPopover
        onRequestClose={this.props.onRequestClose || this.read ('onRequestClose')}
        anchorEl={this.props.anchorEl || this.read ('anchorEl')}
        anchorOrigin={this.props.anchorOrigin || this.read ('anchorOrigin')}
        animated={this.props.animated || this.read ('animated')}
        autoCloseWhenOffScreen={this.props.autoCloseWhenOffScreen || this.read ('autoCloseWhenOffScreen')}
        canAutoPosition={this.props.canAutoPosition || this.read ('canAutoPosition')}
        disabled={disabled}
        open={this.props.open || this.read ('open')}
        targetOrigin={this.props.targetOrigin || this.read ('targetOrigin')}
        useLayerForClickAway={this.props.useLayerForClickAway || this.read ('useLayerForClickAway')}
        zDepth={this.props.zDepth || this.read ('zDepth')}
        {...this.props}
        >
        {this.props.children}
      </MUIPopover>
    );
  }
}

/******************************************************************************/
