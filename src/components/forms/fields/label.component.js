'use strict';

import React from 'react';
import {Action} from 'electrum';
import {Unit} from 'electrum-theme';

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

    var backgroundColor = null;
    var padding         = null;
    var display         = 'flex';
    var flexDirection   = 'row';
    var justifyContent  = 'flex-start';
    var alignItems      = 'center';
    var fontSize        = theme.shapes.labelTextSize;
    var fontWeight      = null;
    var textTransform   = null;
    var color           = theme.palette.text;

    if (inputKind === 'info') {
      backgroundColor = theme.palette.infoBackground;
      justifyContent  = 'center';
      padding         = '0 10px 0 10px';
    }

    if (inputKind === 'title') {
      fontSize        = theme.shapes.labelTitleTextSize;
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
      backgroundColor = theme.palette.infoBackground;
    }

    if (inputKind === 'priceFooter') {
      justifyContent  = 'flex-end';
      padding         = '0 10px 0 10px';
      backgroundColor = theme.palette.infoBackground;
    }

    if (inputKind === 'footer') {
      padding         = '0 20px 0 20px';
      color           = theme.palette.footerText;
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
      fontSize:        Unit.multiply (fontSize, theme.typo.fontScale),
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
