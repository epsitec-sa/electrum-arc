'use strict';

import React from 'react';
import {Action} from 'electrum';
import {Unit} from 'electrum-theme';

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
    const {state, theme, value, grow, spacing, width} = this.props;
    const disabled = Action.isDisabled (state);
    const inputValue   = value   || state.get ('value');
    var   inputGrow    = grow    || state.get ('grow');
    const inputSpacing = spacing || state.get ('spacing');
    var   inputWidth   = width   || state.get ('width');

    const m = Unit.multiply (theme.shapes.containerMargin, 0.5);

    if (!inputGrow) {
      inputGrow = 1;
    }

    if (!inputWidth) {
      inputWidth = '10px';  // any non-zero width
    } else {
      inputGrow = null;  // if specific with exist, don't fill
    }

    // If component has specific width and border, reduce the width to
    // take into account the thickness of the borders left and right.
    if (inputWidth) {
      inputWidth = Unit.sub (inputWidth, '2px');
    }

    var boxStyle = {
      display:         'flex',
      flexDirection:   'row',
      justifyContent:  'flex-start',
      alignItems:      'center',
      flexGrow:        inputGrow,
      border:          '1px solid ' + theme.palette.buttonBorder,
      backgroundColor: theme.palette.buttonBackground,
      padding:         '0px',
      marginTop:       '0px',
      marginLeft:      '0px',
      marginBottom:    '0px',
      marginRight:     '0px',
    };

    var fieldStyle = {
      flexGrow:        1,
      width:           inputWidth,
      height:          theme.shapes.lineHeight,
      border:          'none',
      padding:         '10px',
      margin:          '0px',
    };

    if (inputSpacing === 'overlap') {
      boxStyle.marginRight = '-1px';
    } else if (inputSpacing === 'large') {
      boxStyle.marginRight = m;
    }

    return (
      <span
        disabled={disabled}
        style={boxStyle}
        >
        <input
          onChange={this.onChange}
          onFocus={this.onFocus}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
          onSelect={this.onSelect}
          disabled={disabled}
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
