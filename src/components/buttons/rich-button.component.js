'use strict';

import React from 'react';
import {Action} from 'electrum';
/******************************************************************************/

export default class RichButton extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state, glyph, size, rotate, flip, spin, text, borderless, rightIcon, flowContinuation} = this.props;
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
    const renderSpin            = inputSpin ? 'fa-spin' : '';

    var boxStyle = {
      display:         'flex',
      flexDirection:   'row',
      justifyContent:  'flex-start',
      alignItems:      'center',
      border:          '1px solid #888',
      backgroundColor: '#fff',
      padding:         '0px',
      margin:          '0px',
      ':hover': {
        background: '#c4e6ff',
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
      fontSize:        '65%',
      margin:          '0 10px 0 10px',
    };

    if (inputText) {
      if (inputRightIcon) {
        return (
          <div
            disabled={disabled}
            id={this.props.id}
            style={boxStyle}
            {...this.props}
            >
            <label style={textStyle}>
              {inputText}
            </label>
            <i style={iconStyle}
              className={`fa
                fa-${inputGlyph}
                fa-${inputSize}
                fa-rotate-${inputRotate}
                fa-flip-${inputFlip}
                ${renderSpin}`}
              />
          </div>
        );
      } else {
        return (
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
                {inputText}
              </label>
          </div>
        );
      }
    } else {
      return (
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
        </div>
      );
    }
  }
}

/******************************************************************************/
