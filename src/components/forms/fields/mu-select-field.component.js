'use strict';

import React from 'react';
import {Action} from 'electrum';
import {SelectField as MUISelectField} from 'material-ui';
/******************************************************************************/

export default class MuSelectField extends React.Component {

  constructor (props) {
    super (props);
  }

  onChange (event, index, value) {
    const {id, state} = this.props;
    console.log (`onChange: ${id}, ${state.generation} value=${event.target.value}`);
  }

  render () {
    const {state} = this.props.state;
    const disabled = Action.isDisabled (state);
    return (
      <MUISelectField
        onChange={this.onChange}
        onFocus={this.onFocus}
        id={this.props.id}
        autoWidth={this.props.autoWidth || this.read ('autoWidth')}
        disabled={disabled}
        errorText={this.props.errorText || this.read ('errorText')}
        floatingLabelText={this.props.floatingLabelText || this.read ('floatingLabelText')}
        fullWidth={this.props.fullWidth || this.read ('fullWidth')}
        hintText={this.props.hintText || this.read ('hintText')}
        value={this.props.value || this.read ('value')}
        {...this.props}
        />
    );
  }
}

/******************************************************************************/
