'use strict';

import React from 'react';
import {Action} from 'electrum';
import {fade, darken, lighten} from 'material-ui/utils/colorManipulator';
import * as Theme from '../../theme-base.js';
import * as Unit from '../../unit-helpers.js';
/******************************************************************************/

export default class Label extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state, text, grow, kind, width} = this.props;
    const disabled = Action.isDisabled (state);
    const inputText  = text  || state.get ('text');
    const inputGrow  = grow  || state.get ('grow');
    const inputKind  = kind  || state.get ('kind');
    const inputWidth = width || state.get ('width');

    var labelStyle = {
      display:         'flex',
      flexDirection:   'row',
      justifyContent:  'flex-start',
      alignItems:      'center',
      height:          '32px',
      flexGrow:        inputGrow,
    };

    if (inputWidth) {
      labelStyle.width = inputWidth;
    }

    const darker = darken (Theme.colors.pane, 0.1);

    if (inputKind === 'info') {
      labelStyle.backgroundColor = darker;
      labelStyle.justifyContent  = 'center';
      labelStyle.padding         = '0 10px 0 10px';
    } else if (inputKind === 'title') {
      labelStyle.fontSize        = '125%';
      labelStyle.fontWeight      = 'bold';
      labelStyle.textTransform   = 'uppercase';
    } else if (inputKind === 'article') {
      labelStyle.justifyContent  = 'flex-start';
      labelStyle.padding         = '0 10px 0 10px';
    } else if (inputKind === 'price') {
      labelStyle.justifyContent  = 'flex-end';
      labelStyle.padding         = '0 10px 0 10px';
    } else if (inputKind === 'articleFooter') {
      labelStyle.justifyContent  = 'flex-start';
      labelStyle.padding         = '0 10px 0 10px';
      labelStyle.backgroundColor = darker;
    } else if (inputKind === 'priceFooter') {
      labelStyle.justifyContent  = 'flex-end';
      labelStyle.padding         = '0 10px 0 10px';
      labelStyle.backgroundColor = darker;
    } else if (inputKind === 'footer') {
      labelStyle.padding         = '0 20px 0 20px';
      labelStyle.color           = '#888';
    }

    return (
      <label
        disabled={disabled}
        style={labelStyle}
        {...this.props}
        >
        {inputText}
      </label>
    );
  }
}

/******************************************************************************/
