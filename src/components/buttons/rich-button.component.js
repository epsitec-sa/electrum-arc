'use strict';

import React from 'react';
import {Action} from 'electrum';
/******************************************************************************/

export default class RichButton extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state, glyph, size, rotate, flip, spin, text, border, icon,
      spacing, grow, width} = this.props;
    const disabled = Action.isDisabled (state);
    const inputGlyph   = glyph   || state.get ('glyph');
    const inputSize    = size    || state.get ('size');
    const inputRotate  = rotate  || state.get ('rotate');
    const inputFlip    = flip    || state.get ('flip');
    const inputSpin    = spin    || state.get ('spin');
    const inputText    = text    || state.get ('text');
    const inputBorder  = border  || state.get ('border');
    const inputIcon    = icon    || state.get ('icon');
    const inputSpacing = spacing || state.get ('spacing');
    const inputGrow    = grow    || state.get ('grow');
    const inputWidth   = width   || state.get ('width');

    var boxStyle = {
      display:         'flex',
      flexDirection:   'row',
      justifyContent:  'flex-start',
      alignItems:      'center',
      border:          '1px solid #888',
      padding:         '0px',
      marginTop:       '0px',
      marginLeft:      '0px',
      marginBottom:    '0px',
      marginRight:     '0px',
      ':hover': {
        backgroundColor: '#c4e6ff',
        opacity:         1.0
      }
    };

    if (inputBorder === 'none') {
      boxStyle.border = 'none';
      // Button without border must have same backgroundColor as parent !
    } else {
      boxStyle.backgroundColor = '#fff';
    }

    if (inputSpacing === 'overlap') {
      boxStyle.marginRight = '-1px';
    } else if (inputSpacing === 'large') {
      boxStyle.marginRight = '10px';
    }

    if (inputWidth) {
      boxStyle.width = inputWidth;
    }

    if (inputGrow) {
      boxStyle.flexGrow = inputGrow;
    }

    var iconStyle = {
      display:         'flex',
      flexDirection:   'row',
      justifyContent:  'center',
      alignItems:      'center',
      width:           '32px',
      height:          '32px',
      padding:         '0px',
      margin:          '0px',
      color:           '#555',
    };

    var textStyle = {
      display:         'flex',
      flexDirection:   'row',
      justifyContent:  'center',
      alignItems:      'center',
      flexGrow:        1,
      height:          '32px',
      margin:          '0px 10px 0px 10px',
    };

    if (inputGlyph) {
      if (inputIcon === 'right') {
        textStyle.margin = '0px 0px 0px 10px';
      } else {
        textStyle.margin = '0px 10px 0px 0px';
      }
    }

    const htmlText = (
      <label key='text' style={textStyle}>
        {inputText}
      </label>
    );

    const renderSpin   = inputSpin ? 'fa-spin' : '';
    const htmlIcon = (
      <i key='icon' style={iconStyle}
        className={`fa
        fa-${inputGlyph}
        fa-${inputSize}
        fa-rotate-${inputRotate}
        fa-flip-${inputFlip}
        ${renderSpin}`}
      />
    );

    const layout = () => {
      if (inputGlyph) {
        if (inputText) {
          if (inputIcon === 'right') {
            return [htmlText, htmlIcon];
          } else {
            return [htmlIcon, htmlText];
          }
        } else {
          return [htmlIcon];
        }
      } else {
        return [htmlText];
      }
    };

    return (
      <div
        onClick={this.onClick}
        disabled={disabled}
        style={boxStyle}
        {...this.props}
        >
        {layout ().map ((comp) => comp)}
      </div>
    );
  }
}

/******************************************************************************/
