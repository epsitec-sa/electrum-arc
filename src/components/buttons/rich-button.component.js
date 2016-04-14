'use strict';

import React from 'react';
import {Action} from 'electrum';
/******************************************************************************/

export default class RichButton extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state, glyph, size, rotate, flip, spin, text} = this.props;
    const disabled = Action.isDisabled (state);
    const inputGlyph   = glyph   || state.get ('glyph');
    const inputSize    = size    || state.get ('size');
    const inputRotate  = rotate  || state.get ('rotate');
    const inputFlip    = flip    || state.get ('flip');
    const inputSpin    = spin    || state.get ('spin');
    const inputText    = text    || state.get ('text');
    const renderSpin = inputSpin ? 'fa-spin' : '';

    var boxStyle = {
      display:         'table-cell',
      textAlign:       'center',
      verticalAlign:   'middle',
      border:          '1px solid #888',
      backgroundColor: '#fff',
      padding:         '0px',
      margin:          '0px',
      ':hover': {
        background: '#c4e6ff',
        opacity: 1.0
      }
    };
    var iconStyle = {
      display:         'table-cell',
      width:           '32px',
      height:          '32px',
      textAlign:       'center',
      verticalAlign:   'middle',
      padding:         '0px',
      margin:          '0px',
      color:           '#555',
    };
    var textStyle = {
      fontSize:        '75%',
    };

    return (
      <span>
        <div
          disabled={disabled}
          id={this.props.id}
          style={boxStyle}
          {...this.props}
          >
          <i style={iconStyle}
            className={`fa
              fa-${inputGlyph}
              fa-${inputSize}
              fa-rotate-${inputRotate}
              fa-flip-${inputFlip}
              ${renderSpin}`}
            />
          <label style={textStyle}>
            {text}
          </label>
        </div>
      </span>
    );
  }
}

/******************************************************************************/
