'use strict';

import React from 'react';
import {Action} from 'electrum';
/******************************************************************************/

export default class BasicContainer extends React.Component {

  constructor (props) {
    super (props);
  }

  getZDepthShadows (zDepth) {
    var shadows = [
      '',
      '0  1px  6px rgba(0, 0, 0, 0.12), 0  1px  4px rgba(0, 0, 0, 0.24)',
      '0  3px 10px rgba(0, 0, 0, 0.16), 0  3px 10px rgba(0, 0, 0, 0.23)',
      '0 10px 30px rgba(0, 0, 0, 0.19), 0  6px 10px rgba(0, 0, 0, 0.23)',
      '0 14px 45px rgba(0, 0, 0, 0.25), 0 10px 18px rgba(0, 0, 0, 0.22)',
      '0 19px 60px rgba(0, 0, 0, 0.30), 0 15px 20px rgba(0, 0, 0, 0.22)'
    ];

    return shadows[zDepth];
  }

  render () {
    const {state, width, height, spacing, zDepth, border, kind} = this.props;
    const disabled = Action.isDisabled (state);
    const inputWidth   = width   || state.get ('width');
    const inputHeight  = height  || state.get ('height');
    const inputSpacing = spacing || state.get ('spacing');
    const inputZDepth  = zDepth  || state.get ('zDepth');
    const inputBorder  = border  || state.get ('border');
    const inputKind    = kind    || state.get ('kind');

    var containerStyle = {
      width:           inputWidth,
      height:          inputHeight,
      display:         'flex',
      flexDirection:   'column',
      justifyContent:  'flex-start',
      alignItems:      'stretch',
      border:          '1px solid #888',
      padding:         '20px 20px 10px 20px',
      marginTop:       '0px',
      marginLeft:      '0px',
      marginBottom:    '0px',
      marginRight:     '0px',
      color:           '#333',
    };

    if (inputSpacing === 'overlap') {
      containerStyle.marginBottom = '-1px';
    } else if (inputSpacing === 'large') {
      containerStyle.marginBottom = '20px';
    }

    if (inputWidth) {
      containerStyle.width = inputWidth;
    }

    if (inputZDepth) {
      containerStyle.boxShadow = this.getZDepthShadows (inputZDepth);
    }

    if (inputBorder === 'none') {
      containerStyle.border = 'none';
    }

    if (inputKind === 'root') {
      containerStyle.backgroundColor = '#eee';
    } else {
      containerStyle.backgroundColor = '#fff';
    }

    return (
      <div
        disabled={disabled}
        style={containerStyle}
        {...this.props}
        />
    );
  }
}

/******************************************************************************/
