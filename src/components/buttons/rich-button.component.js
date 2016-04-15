'use strict';

import React from 'react';
import {Action} from 'electrum';
/******************************************************************************/

export default class RichButton extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state, glyph, size, rotate, flip, spin, text, borderless, rightIcon, flowContinuation, grow} = this.props;
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
      <label style={textStyle}>
        {inputText}
      </label>
    );
    const htmlIcon = (
      <i style={iconStyle}
        className={`fa
        fa-${inputGlyph}
        fa-${inputSize}
        fa-rotate-${inputRotate}
        fa-flip-${inputFlip}
        ${renderSpin}`}
      />
    );

    // A strange bug prohibit to put {...this.props} into a const !

    if (inputGlyph) {
      if (inputText) {
        if (inputRightIcon) {
          return (
            <div
              disabled={disabled}
              id={this.props.id}
              style={boxStyle}
              {...this.props}
              >
              {htmlText} {htmlIcon}
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
              {htmlIcon} {htmlText}
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
            {htmlIcon}
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
          {htmlText}
        </div>
      );
    }
  }
}

/******************************************************************************/
