'use strict';

import React from 'react';
import {Action} from 'electrum';
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
    const {state, width, height, kind} = this.props;
    const disabled = Action.isDisabled (state);
    var   inputWidth   = width   || state.get ('width');
    var   inputHeight  = height  || state.get ('height');
    const inputKind    = kind    || state.get ('kind');

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
    var color           = '#333';
    var backgroundColor = null;
    var zIndex          = null;

    if (inputKind === 'root') {
      display         = 'flex';
      flexDirection   = 'row';
      inputHeight     = '100vh';
      boxSizing       = 'border-box';
      backgroundColor = '#24415f';
    }

    if (inputKind === 'left') {
      zIndex          = '2';
      inputWidth      = '80px';
      backgroundColor = '#336799';
      boxShadow       = '0px 0px 60px rgba(0, 0, 0, 0.50)';
    }

    if (inputKind === 'right') {
      display         = 'flex';
      flexDirection   = 'column';
      flexGrow        = 1;
      boxSizing       = 'border-box';
      backgroundColor = '#24415f';
    }

    if (inputKind === 'mainTab') {
      minHeight       = '50px';
      display         = 'flex';
      flexDirection   = 'row';
      flexGrow        = 0;
      justifyContent  = 'flex-start';
      alignItems      = 'center';
      backgroundColor = '#dcdcdc';
    }

    if (inputKind === 'viewTab') {
      minHeight       = '32px';
      display         = 'flex';
      flexDirection   = 'row';
      flexGrow        = 0;
      justifyContent  = 'flex-start';
      alignItems      = 'center';
      padding         = '20px 0px 0px 0px';
      borderStyle     = 'none';
      backgroundColor = '#222';
    }

    if (inputKind === 'footer') {
      minHeight       = '50px';
      display         = 'flex';
      flexDirection   = 'row';
      flexGrow        = 0;
      justifyContent  = 'flex-start';
      alignItems      = 'center';
      backgroundColor = '#222';
    }

    if (inputKind === 'view') {
      display         = 'flex';
      flexDirection   = 'column';
      flexGrow        = 1;
      color           = '#333';
      backgroundColor = '#f5f5f5';
    }

    if (inputKind === 'pageNavigator') {
      minHeight       = '32px';
      display         = 'flex';
      flexDirection   = 'row';
      justifyContent  = 'space-between';
      alignItems      = 'center';
      padding         = '20px 20px 0px 20px';
      margin          = '0px 0px 20px 0px';
      borderWidth     = '1px';
      borderStyle     = 'none none solid none';
      borderColor     = '#ccc';
    }

    if (inputKind === 'actions') {
      display         = 'flex';
      flexDirection   = 'row';
      justifyContent  = 'space-between';
      alignItems      = 'center';
      padding         = '20px 20px 20px 20px';
      borderStyle     = 'none';
      backgroundColor = '#fff';
    }

    if (inputKind === 'panes') {
      flexGrow        = 1;
      overflow        = 'auto';
      padding         = '0px 20px 0px 20px';
    }

    if (inputKind === 'pane') {
      display         = 'flex';
      flexDirection   = 'column';
      justifyContent  = 'flex-start';
      alignItems      = 'stretch';
      boxShadow       = this.getZDepthShadows (2);
      margin          = '0px 0px 20px 0px';
      padding         = '20px 20px 10px 20px';
      color           = '#333';
      backgroundColor = '#fff';
    }

    var containerStyle = {
      width:           inputWidth,
      height:          inputHeight,
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
      color:           color,
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
