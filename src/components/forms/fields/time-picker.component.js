'use strict';

import React from 'react';
import {Action} from 'electrum';
import {TimePicker as MUITimePicker} from 'material-ui';
/******************************************************************************/

export default class TimePicker extends React.Component {

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
      <MUITimePicker
        onChange={this.onChange}
        onFocus={this.onFocus}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        onSelect={this.onSelect}
        id={this.props.id}
        autoOk={this.props.autoOk || this.read ('autoOk')}
        container={this.props.container || this.read ('container')}  // H.S. ?
        defaultTime={this.props.defaultTime || this.read ('defaultTime')}
        disabled={disabled}
        format='24hr'
        hintText={this.props.hintText || this.read ('hintText')}
        value={this.props.value || this.read ('value')}
        wordings={{ok: 'OK', cancel: 'Annuler'}}  // H.S. ?
        {...this.props}
        />
    );
  }
}

/******************************************************************************/
