'use strict';

import React from 'react';
import {Action} from 'electrum';
/******************************************************************************/

export default class Checkbox extends React.Component {
  render () {
    const {state, label, checked} = this.props;
    const disabled = Action.isDisabled (state);
    const checkprop = {
      checked: checked
    };

    var boxStyle = {
      display:         'flex',
      flexDirection:   'row',
      justifyContent:  'flex-start',
      alignItems:      'center',
      backgroundColor: '#fff',
      padding:         '0px',
      margin:          '0px',
    };
    var buttonStyle = {
      padding:         '0px',
      margin:          '0px',
      color:           '#555',
      fontSize:        '65%',
    };

    return (
      <span
      style={boxStyle}
      {...this.props}
      >
      <input style={buttonStyle}
        onClick={this.onClick}
        disabled={disabled}
        id={this.props.id}
        type='checkbox'
        {...checkprop}
        {...this.props}
        />
      {label}
      </span>
    );
  }
}
