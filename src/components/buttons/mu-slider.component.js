'use strict';

import React from 'react';
import {Action} from 'electrum';
import {Slider as MUISlider} from 'material-ui';
/******************************************************************************/

export default class MuSlider extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state} = this.props.state;
    const disabled = Action.isDisabled (state);
    return (
      <MUISlider
        defaultValue={this.props.defaultValue || this.read ('defaultValue')}
        description={this.props.description || this.read ('description')}
        disableFocusRipple={this.props.disableFocusRipple || this.read ('disableFocusRipple')}
        disabled={disabled}
        error={this.props.error || this.read ('error')}
        max={this.props.max || this.read ('max')}
        min={this.props.min || this.read ('min')}
        name={this.props.name || this.read ('name')}
        required={this.props.required || this.read ('required')}
        step={this.props.step || this.read ('step')}
        value={this.props.value || this.read ('value')}
        {...this.props}
        >
        {this.props.children}
      </MUISlider>
    );
  }
}

/******************************************************************************/
