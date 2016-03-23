'use strict';

import React from 'react';
import {Action} from 'electrum';
import {IconButton as MUIIconButton} from 'material-ui';
/******************************************************************************/

export default class IconButton extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state, glyph, size, rotate, flip, spin, rounded, active} = this.props;
    const disabled = Action.isDisabled (state);
    const awesome = this.props.awesome || this.read ('awesome');

    if (awesome) {
      const inputGlyph   = glyph   || state.get ('glyph');
      const inputSize    = size    || state.get ('size');
      const inputRotate  = rotate  || state.get ('rotate');
      const inputFlip    = flip    || state.get ('flip');
      const inputSpin    = spin    || state.get ('spin');
      const inputRounded = rounded || state.get ('rounded');
      const inputActive  = active  || state.get ('active');
      const renderSpin = inputSpin ? 'fa-spin' : '';

      var iconColor = '#000';
      var iconHoverColor = '#777';

      var divStyle;
      if (inputRounded) {
        const paddingDict = {
          '2x': '10px',
          '3x': '20px',
        };
        var padding = paddingDict[inputSize];
        if (!padding) {
          padding = '5px';
        }
        iconColor = '#fff';
        iconHoverColor = '#aaa';
        divStyle = {
          backgroundColor: '#336699',
          borderRadius: '1000px',
          padding: padding,
          color: iconColor,
        };
      }

      var iconStyle = {
        display:       'table-cell',
        width:         '32px',
        height:        '32px',
        textAlign:     'center',
        verticalAlign: 'middle',
        // backgroundColor: '#bbb',
      };
      if (inputActive) {
        iconStyle[':hover'] = {
          color: iconHoverColor,
        };
      }
      if (this.props.kind === 'normal') {
        iconStyle.width  = '48px';
        iconStyle.height = '48px';
      }
      if (this.props.kind === 'large') {
        iconStyle.width  = '64px';
        iconStyle.height = '64px';
      }

      return (
        <span style={divStyle}>
          <i style={iconStyle}
            className={`fa
              fa-${inputGlyph}
              fa-${inputSize}
              fa-rotate-${inputRotate}
              fa-flip-${inputFlip}
              ${renderSpin}`}/>
        </span>
      );
    } else {
      return (
        <MUIIconButton
          onTouchTap={this.onClick}
          disabled={disabled}
          tooltip={this.props.tooltip || this.read ('tooltip')}
          {...this.props}
          >
          {this.props.children}
        </MUIIconButton>
      );
    }
  }
}

/******************************************************************************/
