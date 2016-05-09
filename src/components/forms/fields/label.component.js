'use strict';

import React from 'react';
import {Action, ColorManipulator} from 'electrum';
import * as Unit from '../../unit-helpers.js';

const {fade, darken, lighten} = ColorManipulator;

/******************************************************************************/

export default class Label extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state, theme, text, grow, kind, width} = this.props;
    const disabled = Action.isDisabled (state);
    const inputText  = text  || state.get ('text');
    const inputGrow  = grow  || state.get ('grow');
    const inputKind  = kind  || state.get ('kind');
    const inputWidth = width || state.get ('width');

    const darker = darken (theme.palette.pane, 0.1);

    var backgroundColor = null;
    var padding         = null;
    var display         = 'flex';
    var flexDirection   = 'row';
    var justifyContent  = 'flex-start';
    var alignItems      = 'center';
    var fontSize        = '100%';
    var fontWeight      = null;
    var textTransform   = null;
    var color           = null;

    if (inputKind === 'info') {
      backgroundColor = darker;
      justifyContent  = 'center';
      padding         = '0 10px 0 10px';
    }

    if (inputKind === 'title') {
      fontSize        = '125%';
      fontWeight      = 'bold';
      textTransform   = 'uppercase';
    }

    if (inputKind === 'article') {
      justifyContent  = 'flex-start';
      padding         = '0 10px 0 10px';
    }

    if (inputKind === 'price') {
      justifyContent  = 'flex-end';
      padding         = '0 10px 0 10px';
    }

    if (inputKind === 'articleFooter') {
      justifyContent  = 'flex-start';
      padding         = '0 10px 0 10px';
      backgroundColor = darker;
    }

    if (inputKind === 'priceFooter') {
      justifyContent  = 'flex-end';
      padding         = '0 10px 0 10px';
      backgroundColor = darker;
    }

    if (inputKind === 'footer') {
      padding         = '0 20px 0 20px';
      color           = '#888';
    }

    var labelStyle = {
      width:           inputWidth,
      height:          theme.shapes.lineHeight,
      padding:         padding,
      display:         display,
      flexDirection:   flexDirection,
      justifyContent:  justifyContent,
      alignItems:      alignItems,
      flexGrow:        inputGrow,
      fontSize:        Unit.multiply (fontSize, theme.shapes.fontScale),
      fontWeight:      fontWeight,
      textTransform:   textTransform,
      color:           color,
      backgroundColor: backgroundColor,
    };

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
