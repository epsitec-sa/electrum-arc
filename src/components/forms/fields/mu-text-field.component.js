'use strict';

import React from 'react';
import {Action} from 'electrum';
import {TextField as MUITextField} from 'material-ui';
/******************************************************************************/

export default class MuTextField extends React.Component {

  constructor (props) {
    super (props);
  }

  onKeyDown (e) {
    const {id, state} = this.props;
    console.log (`onKeyDown: ${id}, ${state.generation} value=${e.target.value}`);
  }

  onKeyUp (e) {
    const {id, state} = this.props;
    console.log (`onKeyUp: ${id}, ${state.generation} value=${e.target.value}`);
  }

  onChange (e) {
    const {id, state} = this.props;
    console.log (`onChange: ${id}, ${state.generation} value=${e.target.value}`);
  }

  render () {
    const {state} = this.props.state;
    const disabled = Action.isDisabled (state);
    return (
      <MUITextField
        onChange={this.onChange}
        onFocus={this.onFocus}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        onSelect={this.onSelect}
        id={this.props.id}
        disabled={disabled}
        errorText={this.props.errorText || this.read ('errorText')}
        floatingLabelText={this.props.floatingLabelText || this.read ('floatingLabelText')}
        hintText={this.props.hintText || this.read ('hintText')}
        maxLength={this.props.maxLength}
        multiLine={this.props.multiLine || this.read ('multiLine')}
        rows={this.props.rows || this.read ('rows')}
        rowsMax={this.props.rowsMax || this.read ('rowsMax')}
        type={'text'}
        value={this.props.value || this.read ('value')}
        {...this.props}
        />
    );
  }
}

/******************************************************************************/
