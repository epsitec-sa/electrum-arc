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
    const {state, width, height, zDepth, kind} = this.props;
    const disabled = Action.isDisabled (state);
    var   inputWidth   = width   || state.get ('width');
    var   inputHeight  = height  || state.get ('height');
    const inputZDepth  = zDepth  || state.get ('zDepth');
    const inputKind    = kind    || state.get ('kind');

    var display         = null;
    var overflow        = null;
    var flexDirection   = null;
    var flexGrow        = null;
    var justifyContent  = null;
    var alignItems      = null;
    var borderWidth     = null;
    var borderStyle     = 'none';
    var borderColor     = null;
    var boxShadow       = this.getZDepthShadows (inputZDepth);
    var boxSizing       = null;
    var padding         = '0px';
    var margin          = '0px';
    var color           = '#333';
    var backgroundColor = '#fff';
    var zIndex          = null;

    if (inputKind === 'root') {
      display         = 'flex';
      flexDirection   = 'row';
      inputHeight     = '100vh';
      boxSizing       = 'border-box';
      backgroundColor = '#24415f';
    } else if (inputKind === 'left') {
      zIndex          = '2';
      inputWidth      = '80px';
      backgroundColor = '#336799';
      boxShadow       = '0px 0px 60px rgba(0, 0, 0, 0.50)';
    } else if (inputKind === 'right') {
      display         = 'flex';
      flexDirection   = 'column';
      flexGrow        = 1;
      boxSizing       = 'border-box';
      backgroundColor = '#24415f';
      boxShadow       = '0px 0px 60px rgba(0, 0, 0, 0.50)';
    } else if (inputKind === 'mainTab') {
      display         = 'flex';
      flexDirection   = 'row';
      flexGrow        = 0;
      justifyContent  = 'flex-start';
      alignItems      = 'center';
      backgroundColor = '#dcdcdc';
    } else if (inputKind === 'viewTab') {
      display         = 'flex';
      flexDirection   = 'row';
      flexGrow        = 0;
      justifyContent  = 'flex-start';
      alignItems      = 'center';
      padding         = '20px 0px 0px 0px';
      borderStyle     = 'none';
      backgroundColor = '#222';
    } else if (inputKind === 'footer') {
      inputHeight     = '50px';
      display         = 'flex';
      flexDirection   = 'row';
      flexGrow        = 0;
      justifyContent  = 'flex-start';
      alignItems      = 'center';
      backgroundColor = '#222';
    } else if (inputKind === 'view') {
      padding         = '20px 20px 10px 20px';
      color           = '#333';
      backgroundColor = '#fff';
    } else if (inputKind === 'pageNavigator') {
      display         = 'flex';
      flexDirection   = 'row';
      justifyContent  = 'space-between';
      alignItems      = 'center';
      padding         = '0px 20px 0px 20px';
      margin          = '0px -20px 20px -20px';
      borderWidth     = '1px';
      borderStyle     = 'none none solid none';
      borderColor     = '#ccc';
    } else if (inputKind === 'actions') {
      display         = 'flex';
      flexDirection   = 'row';
      justifyContent  = 'space-between';
      alignItems      = 'center';
      padding         = '20px 20px 20px 20px';
      margin          = '0px -20px -10px -20px';
      borderStyle     = 'none';
      backgroundColor = '#fff';
    } else if (inputKind === 'panes') {
      overflow        = 'auto';
      inputHeight     = '1000px';
    } else if (inputKind === 'pane') {
      display         = 'flex';
      flexDirection   = 'column';
      justifyContent  = 'flex-start';
      alignItems      = 'stretch';
      borderWidth     = '1px';
      borderStyle     = 'solid';
      borderColor     = '#888';
      padding         = '20px 20px 10px 20px';
      color           = '#333';
    }

    var containerStyle = {
      width:           inputWidth,
      height:          inputHeight,
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
      padding:         padding,
      margin:          margin,
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
