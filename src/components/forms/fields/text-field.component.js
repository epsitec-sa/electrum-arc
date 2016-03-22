'use strict';

import React from 'react';
import {Action} from 'electrum';
import {TextField as MUITextField} from 'material-ui';
/******************************************************************************/

export default class TextField extends React.Component {

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
    console.dir (this.read ());
    const disabled = Action.isDisabled (state);
    return (
      <MUITextField
        onChange={this.onChange}
        onFocus={this.onFocus}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        onSelect={this.onSelect}
        type={this.props.type || 'text'}
        id={this.props.id}
        key='input'
        floatingLabelText={this.props.placeholder || this.read ('placeholder')}
        disabled={disabled}
        value={this.read ()}
        maxLength={this.props.maxLength}
        {...this.props}
        />
    );
  }
}

/******************************************************************************/
