'use strict';

import React from 'react';
import {Action} from 'electrum';
/******************************************************************************/

export default class BasicCheckbox extends React.Component {
  render () {
    const {state, label, checked} = this.props;
    const disabled = Action.isDisabled (state);
    const checkprop = {
      checked: checked
    };

    var boxStyle = {
      display:         'table-cell',
      textAlign:       'center',
      verticalAlign:   'middle',
      border:          'none',
      backgroundColor: '#fff',
      padding:         '0px',
      margin:          '0px',
    };
    var buttonStyle = {
      display:         'table-cell',
      height:          '32px',
      textAlign:       'center',
      verticalAlign:   'middle',
      padding:         '0px',
      margin:          '0px',
      color:           '#555',
      fontSize:        '75%',
    };

    return (
      <span>
        <span
        id={this.props.id}
        style={boxStyle}
        {...this.props}
        >
        <input style={buttonStyle}
          onClick={this.onClick}
          disabled={disabled}
          type='checkbox'
          {...checkprop}
          {...this.props}
          />
        {label}
        </span>
      </span>
    );
  }
}
