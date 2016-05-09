'use strict';

import React from 'react';
import {Action, ColorManipulator} from 'electrum';
import * as Unit from '../unit-helpers.js';

const {fade, darken, lighten, emphasize} = ColorManipulator;

/******************************************************************************/

export default class RichContainer extends React.Component {

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
    const {state, theme, width, height, kind, spacing} = this.props;
    const disabled = Action.isDisabled (state);
    var   inputWidth   = width   || state.get ('width');
    var   inputHeight  = height  || state.get ('height');
    const inputKind    = kind    || state.get ('kind');
    const inputSpacing = spacing || state.get ('spacing');

    var minWidth        = null;
    var minHeight       = null;
    var display         = null;
    var overflow        = null;
    var flexDirection   = null;
    var flexGrow        = null;
    var justifyContent  = null;
    var alignItems      = null;
    var borderWidth     = null;
    var borderStyle     = 'none';
    var borderColor     = null;
    var boxShadow       = null;
    var boxSizing       = null;
    var margin          = '0px';
    var padding         = '0px';
    var backgroundColor = null;
    var zIndex          = null;

    const h = theme.shapes.lineHeight;
    const m = theme.shapes.containerMargin;
    const s = theme.shapes.lineSpacing;
    const d = Unit.multiply (m, 0.5);

    if (inputKind === 'root') {
      display         = 'flex';
      flexDirection   = 'row';
      inputHeight     = '100vh';
      boxSizing       = 'border-box';
      backgroundColor = darken (theme.palette.base, 0.4);
    }

    if (inputKind === 'left') {
      zIndex          = '2';
      minWidth        = theme.shapes.leftWidth;
      backgroundColor = theme.palette.base;
      boxShadow       = '0px 0px 60px rgba(0, 0, 0, 0.50)';
    }

    if (inputKind === 'right') {
      display         = 'flex';
      flexDirection   = 'column';
      flexGrow        = 1;
      boxSizing       = 'border-box';
    }

    if (inputKind === 'mainTab') {
      minHeight       = Unit.multiply (theme.shapes.lineHeight, 1.5);
      display         = 'flex';
      flexDirection   = 'row';
      flexGrow        = 0;
      justifyContent  = 'flex-start';
      alignItems      = 'center';
      backgroundColor = darken (theme.palette.light, 0.2);
    }

    if (inputKind === 'viewTab') {
      minHeight       = Unit.multiply (theme.shapes.lineHeight, 1.0);
      display         = 'flex';
      flexDirection   = 'row';
      flexGrow        = 0;
      justifyContent  = 'flex-start';
      alignItems      = 'center';
      padding         = m + ' 0px 0px 0px';
      borderStyle     = 'none';
      backgroundColor = theme.palette.dark;
    }

    if (inputKind === 'footer') {
      minHeight       = Unit.multiply (theme.shapes.lineHeight, 2.0);
      display         = 'flex';
      flexDirection   = 'row';
      flexGrow        = 0;
      justifyContent  = 'flex-start';
      alignItems      = 'center';
      backgroundColor = theme.palette.dark;
    }

    if (inputKind === 'view') {
      display         = 'flex';
      flexDirection   = 'column';
      flexGrow        = 1;
      backgroundColor = darken (theme.palette.light, 0.05);
    }

    if (inputKind === 'paneNavigator') {
      minHeight       = h;
      display         = 'flex';
      flexDirection   = 'row';
      justifyContent  = 'space-between';
      alignItems      = 'center';
      padding         = m + ' ' + m + ' 0px ' + m;
      margin          = '0px 0px ' + m + ' 0px';
      borderWidth     = '1px';
      borderStyle     = 'none none solid none';
      borderColor     = emphasize (theme.palette.dark, 0.8);
      backgroundColor = darken (theme.palette.light, 0.05);
    }

    if (inputKind === 'actions') {
      minHeight       = Unit.multiply (theme.shapes.lineHeight, 1.5);
      display         = 'flex';
      flexDirection   = 'row';
      justifyContent  = 'space-between';
      alignItems      = 'center';
      padding         = m;
      borderStyle     = 'none';
      backgroundColor = theme.shapes.light;
    }

    if (inputKind === 'panes') {
      flexGrow        = 1;
      overflow        = 'auto';
      padding         = '0px ' + m + ' 0px ' + m;
    }

    if (inputKind === 'pane') {
      display         = 'flex';
      flexDirection   = 'column';
      justifyContent  = 'flex-start';
      alignItems      = 'stretch';
      boxShadow       = this.getZDepthShadows (2);
      margin          = '0px 0px ' + m + ' 0px';
      padding         = m + ' ' + m + ' ' + d + ' ' + m;
      backgroundColor = theme.palette.light;
    }

    if (inputKind === 'rowPane') {
      display        = 'flex';
      flexDirection  = 'row';
      justifyContent = 'space-between';
      alignItems     = 'center';
      margin         = '0px 0px ' + s + ' 0px';
      if (inputSpacing === 'compact') {
        margin         = '0px';
      }
    }

    var containerStyle = {
      width:           inputWidth,
      height:          inputHeight,
      minWidth:        minWidth,
      minHeight:       minHeight,
      display:         display,
      overflow:        overflow,
      flexDirection:   flexDirection,
      flexGrow:        flexGrow,
      justifyContent:  justifyContent,
      alignItems:      alignItems,
      borderWidth:     borderWidth,
      borderStyle:     borderStyle,
      borderColor:     borderColor,
      boxShadow:       boxShadow,
      boxSizing:       boxSizing,
      margin:          margin,
      padding:         padding,
      backgroundColor: backgroundColor,
      zIndex:          zIndex,
    };

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
