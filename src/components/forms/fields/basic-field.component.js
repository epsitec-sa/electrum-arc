'use strict';

import React from 'react';
import {Action} from 'electrum';
/******************************************************************************/

export default class BasicField extends React.Component {

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

    var fieldStyle = {
      border: '1px solid #888',
      backgroundColor: '#fff',
      padding: '5px',
    };

    return (
      <input
        onChange={this.onChange}
        onFocus={this.onFocus}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        onSelect={this.onSelect}
        disabled={disabled}
        id={this.props.id}
        maxLength={this.props.maxLength}
        placeholder={this.props.hintText || this.read ('hintText')}
        style={fieldStyle}
        type={this.props.type || 'text'}
        key='input'
        value={this.props.value || this.read ('value')}
        {...this.props}
        />
    );
  }
}

/******************************************************************************/
