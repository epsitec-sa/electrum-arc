'use strict';

import React from 'react';
import {Action} from 'electrum';
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
    const {state, value, grow, spacing} = this.props;
    const disabled = Action.isDisabled (state);
    const inputValue   = value   || state.get ('value');
    var   inputGrow    = grow    || state.get ('grow');
    const inputSpacing = spacing || state.get ('spacing');

    if (!inputGrow) {
      inputGrow = 1;
    }

    var boxStyle = {
      display:         'flex',
      flexDirection:   'row',
      justifyContent:  'flex-start',
      alignItems:      'center',
      flexGrow:        inputGrow,
      border:          '1px solid #888',
      backgroundColor: '#fff',
      padding:         '0px',
      marginTop:       '0px',
      marginLeft:      '0px',
      marginBottom:    '0px',
      marginRight:     '0px',
    };
    var fieldStyle = {
      flexGrow:        1,
      width:           '50px',
      height:          '32px',
      border:          'none',
      padding:         '10px',
      margin:          '0px',
    };

    if (inputSpacing === 'overlap') {
      boxStyle.marginRight = '-1px';
    } else if (inputSpacing === 'large') {
      boxStyle.marginRight = '10px';
    }

    return (
      <span
        disabled={disabled}
        style={boxStyle}
        {...this.props}
        >
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
          size={this.props.size || 'size'}
          style={fieldStyle}
          type={this.props.type || 'text'}
          key='input'
          value={inputValue}
          {...this.props}
          />
      </span>
    );
  }
}

/******************************************************************************/
