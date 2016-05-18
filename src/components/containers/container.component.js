'use strict';

import React from 'react';
import {Action} from 'electrum';
import {Unit} from 'electrum-theme';

/******************************************************************************/

export default class Container extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state, theme} = this.props;
    const disabled = Action.isDisabled (state);
    var   inputWidth      = this.read ('width');
    var   inputHeight     = this.read ('height');
    const inputKind       = this.read ('kind');
    const inputHeightType = this.read ('height-type');
    const inputSpacing    = this.read ('spacing');

    var minWidth        = null;
    var minHeight       = null;
    var display         = null;
    var overflowX       = null;
    var overflowY       = null;
    var flexDirection   = null;
    var flexGrow        = null;
    var justifyContent  = null;
    var alignItems      = null;
    var alignContent    = null;
    var alignSelf       = null;
    var borderWidth     = null;
    var borderStyle     = 'none';
    var borderColor     = null;
    var boxShadow       = null;
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
      backgroundColor = theme.palette.rootBackground;
    }

    if (inputKind === 'task') {
      zIndex          = '2';
      minWidth        = theme.shapes.taskButtonWidth;
      backgroundColor = theme.palette.taskBackground;
      boxShadow       = theme.shapes.taskShadow;
    }

    if (inputKind === 'right') {
      display         = 'flex';
      flexDirection   = 'column';
      flexGrow        = 1;
      overflowX       = 'hidden';
    }

    if (inputKind === 'main-tab') {
      minHeight       = theme.shapes.mainTabHeight;
      display         = 'flex';
      flexDirection   = 'row';
      flexGrow        = 0;
      justifyContent  = 'flex-start';
      alignItems      = 'center';
      backgroundColor = theme.palette.mainTabBackground;
    }

    if (inputKind === 'view-tab') {
      minHeight       = theme.shapes.viewTabHeight;
      display         = 'flex';
      flexDirection   = 'row';
      flexGrow        = 0;
      justifyContent  = 'flex-start';
      alignItems      = 'center';
      padding         = m + ' 0px 0px 0px';
      borderStyle     = 'none';
      backgroundColor = theme.palette.viewTabBackground;
    }

    if (inputKind === 'footer') {
      minHeight       = theme.shapes.footerHeight;
      display         = 'flex';
      flexDirection   = 'row';
      flexGrow        = 0;
      justifyContent  = 'flex-start';
      alignItems      = 'center';
      backgroundColor = theme.palette.footerBackground;
    }

    if (inputKind === 'views') {
      display         = 'flex';
      flexDirection   = 'row';
      flexGrow        = 1;
      overflowX       = 'auto';
    }

    if (inputKind === 'view') {
      minWidth        = inputWidth;
      display         = 'flex';
      flexDirection   = 'column';
      margin          = '0px ' + theme.shapes.viewSpacing + ' 0px 0px';
      backgroundColor = theme.palette.viewBackground;
      if (inputHeightType === 'short') {
        alignSelf     = 'flex-start';
      }
    }

    if (inputKind === 'pane-navigator') {
      minHeight       = h;
      display         = 'flex';
      flexDirection   = 'row';
      justifyContent  = 'space-between';
      alignItems      = 'center';
      padding         = m + ' ' + m + ' 0px ' + m;
      margin          = '0px 0px ' + m + ' 0px';
      borderWidth     = '1px';
      borderStyle     = 'none none solid none';
      borderColor     = theme.palette.paneNavigatorInactiveBorder;
      backgroundColor = theme.palette.paneNavigatorBackground;
    }

    if (inputKind === 'actions') {
      minHeight       = theme.shapes.actionHeight;
      display         = 'flex';
      flexDirection   = 'row';
      justifyContent  = 'space-between';
      alignItems      = 'center';
      padding         = m;
      borderStyle     = 'none';
      backgroundColor = theme.shapes.actionBackground;
    }

    if (inputKind === 'panes') {
      flexGrow        = 1;
      overflowY       = 'auto';
      padding         = '0px ' + m + ' 0px ' + m;
    }

    if (inputKind === 'pane') {
      display         = 'flex';
      flexDirection   = 'column';
      justifyContent  = 'flex-start';
      alignItems      = 'stretch';
      boxShadow       = theme.shapes.paneShadow;
      margin          = '0px 0px ' + m + ' 0px';
      padding         = m + ' ' + m + ' ' + d + ' ' + m;
      backgroundColor = theme.palette.paneBackground;
    }

    if (inputKind === 'row-pane') {
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
      overflowX:       overflowX,
      overflowY:       overflowY,
      flexDirection:   flexDirection,
      flexGrow:        flexGrow,
      justifyContent:  justifyContent,
      alignItems:      alignItems,
      alignContent:    alignContent,
      alignSelf:       alignSelf,
      borderWidth:     borderWidth,
      borderStyle:     borderStyle,
      borderColor:     borderColor,
      boxShadow:       boxShadow,
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
