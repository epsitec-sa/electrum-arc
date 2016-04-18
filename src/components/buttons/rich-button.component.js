'use strict';

import React from 'react';
import {Action} from 'electrum';
/******************************************************************************/

export default class RichButton extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state, glyph, size, rotate, flip, spin, text, borderless, rightIcon,
      flowContinuation, grow, width} = this.props;
    const disabled = Action.isDisabled (state);
    const inputGlyph            = glyph            || state.get ('glyph');
    const inputSize             = size             || state.get ('size');
    const inputRotate           = rotate           || state.get ('rotate');
    const inputFlip             = flip             || state.get ('flip');
    const inputSpin             = spin             || state.get ('spin');
    const inputText             = text             || state.get ('text');
    const inputBorderless       = borderless       || state.get ('borderless');
    const inputRightIcon        = rightIcon        || state.get ('rightIcon');
    const inputFlowContinuation = flowContinuation || state.get ('flowContinuation');
    const inputGrow             = grow             || state.get ('grow');
    const inputWidth            = width            || state.get ('width');
    const renderSpin            = inputSpin ? 'fa-spin' : '';

    var boxStyle = {
      display:         'flex',
      flexDirection:   'row',
      justifyContent:  'flex-start',
      alignItems:      'center',
      border:          '1px solid #888',
      backgroundColor: '#fff',
      padding:         '0px',
      marginTop:       '0px',
      marginLeft:      '0px',
      marginBottom:    '0px',
      marginRight:     '0px',
      ':hover': {
        backgroundColor: '#c4e6ff',
        opacity: 1.0
      }
    };
    if (inputBorderless) {
      boxStyle.border = 'none';
    }
    if (inputFlowContinuation === 'overlay') {
      boxStyle.marginRight = '-1px';
    } else if (inputFlowContinuation === 'spacing') {
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
      fontSize:        '65%',
      margin:          '0 10px 0 10px',
    };

    const htmlText = (
      <label key='text' style={textStyle}>
        {inputText}
      </label>
    );

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
          if (inputRightIcon) {
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
        id={this.props.id}
        style={boxStyle}
        {...this.props}
        >
        {layout ().map ((comp) => comp)}
      </div>
    );
  }
}

/******************************************************************************/
