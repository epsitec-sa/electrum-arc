'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

function GetMarkColor (theme, mark) {
  if (mark.startsWith ('#')) {
    return mark;
  } else {
    const fix = {
      primary:   theme.palette.markPrimary,
      secondary: theme.palette.markSecondary
    };
    return fix[mark];
  }
}

export default function styles (theme, props) {
  let   inputWidth      = props.width;
  let   inputHeight     = props.height;
  const inputKind       = props.kind;
  const inputSubkind    = props.subkind;
  const inputMarkColor  = props.markColor;
  const inputHeightType = props.heightType;
  const inputSpacing    = props.spacing;

  let minWidth          = null;
  let minHeight         = null;
  let display           = null;
  let overflowX         = null;
  let overflowY         = null;
  let flexDirection     = null;
  let flexGrow          = null;
  let flexShrink        = null;
  let flexBasis         = null;
  let justifyContent    = null;
  let alignItems        = null;
  let alignContent      = null;
  let alignSelf         = null;
  let borderWidth       = null;
  let borderStyle       = 'none';
  let borderColor       = null;
  let borderTopWidth    = null;
  let borderTopStyle    = null;
  let borderTopColor    = null;
  let borderRightWidth  = null;
  let borderRightStyle  = null;
  let borderRightColor  = null;
  let borderBottomWidth = null;
  let borderBottomStyle = null;
  let borderBottomColor = null;
  let borderLeftWidth   = null;
  let borderLeftStyle   = null;
  let borderLeftColor   = null;
  let borderRadius      = null;
  let boxShadow         = null;
  let margin            = '0px';
  let padding           = '0px';
  let backgroundColor   = null;
  let fontWeight        = null;
  let zIndex            = null;
  let position          = null;

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
    zIndex          = 2;
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

  if (inputKind === 'view-wedge') {
    flexGrow        = 1;
  }

  if (inputKind === 'pane-header') {
    minHeight       = inputHeight;
    flexDirection   = 'row';
    justifyContent  = 'space-between';
    padding         = m;
    margin          = '0px 0px ' + m + ' 0px';
    backgroundColor = theme.palette.paneHeaderBackground;
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

  if (inputKind === 'pane-hnavigator') {
    minHeight       = h;
    display         = 'flex';
    flexDirection   = 'row';
    alignItems      = 'center';
    padding         = m + ' ' + m + ' 0px ' + m;
    margin          = '0px 0px ' + m + ' 0px';
    borderWidth     = '1px';
    borderStyle     = 'none none solid none';
    borderColor     = theme.palette.paneNavigatorInactiveBorder;
    backgroundColor = theme.palette.paneNavigatorBackground;
  }

  if (inputKind === 'pane-vnavigator') {
    position        = 'absolute';
    minHeight       = h;
    display         = 'flex';
    flexDirection   = 'column';
    padding         = '0px';
    margin          = '0px 0px 0px ' + Unit.multiply (theme.shapes.vnavigatorButtonSize, -1);
    backgroundColor = theme.palette.vnavigatorButtonBackground;
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
    borderTopWidth  = '1px';
    borderTopStyle  = 'solid';
    borderTopColor  = theme.palette.actionBorder;
    boxShadow       = theme.shapes.actionShadow;
    zIndex          = 2;
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
    // boxShadow       = theme.shapes.paneShadow;
    margin          = '0px 0px ' + m + ' 0px';
    padding         = m + ' ' + m + ' ' + d + ' ' + m;
    backgroundColor = theme.palette.paneBackground;
  }

  if (inputKind === 'row-pane') {
    const halfMargin     = Unit.multiply (m, 0.5);
    display              = 'flex';
    flexDirection        = 'row';
    justifyContent       = 'space-between';
    alignItems           = 'center';
    let topMargin        = '0px';
    let rightMargin      = '0px';
    let bottomMargin     = s;
    let leftMargin       = '0px';
    if (inputSubkind === 'info') {
      inputHeight      = theme.shapes.lineHeight;
      backgroundColor  = theme.palette.infoBackground;
      borderRadius     = theme.shapes.smoothRadius;
      fontWeight       = 'bold';
      padding          = '0px ' + halfMargin;
    } else if (inputSubkind === 'wide-info') {
      rightMargin      = Unit.multiply (m, -1);
      leftMargin       = Unit.multiply (m, -1);
      padding          = '0px ' + m;
      backgroundColor  = theme.palette.infoBackground;
      fontWeight       = 'bold';
    } else if (inputSubkind === 'box') {
      rightMargin       = Unit.multiply (m, -1);
      leftMargin        = Unit.multiply (m, -1);
      let topPadding    = halfMargin;
      let rightPadding  = m;
      let bottomPadding = halfMargin;
      let leftPadding   = m;
      padding           = halfMargin + ' ' + m;
      borderTopColor    = theme.palette.paneNavigatorInactiveBorder;
      borderBottomColor = theme.palette.paneNavigatorInactiveBorder;
      borderTopWidth    = '1px';
      borderBottomWidth = '1px';
      borderTopStyle    = 'solid';
      borderBottomStyle = 'solid';
      topMargin         = halfMargin;
      bottomMargin      = Unit.sub (Unit.multiply (halfMargin, -1), '1px');
      if (inputMarkColor) {
        padding         = halfMargin + ' ' + m;
        borderLeftWidth = theme.shapes.markWidth;
        borderLeftStyle = 'solid';
        borderLeftColor = GetMarkColor (theme, inputMarkColor);
        leftPadding = Unit.sub (leftPadding, theme.shapes.markWidth);
      }
      padding = topPadding + ' ' + rightPadding + ' ' + bottomPadding + ' ' + leftPadding;
    } else if (inputSubkind === 'list') {
      borderBottomColor = theme.palette.paneNavigatorInactiveBorder;
      borderBottomWidth = '1px';
      borderBottomStyle = 'solid';
      padding           = '0px';
      bottomMargin      = '0px';
    } else if (inputSubkind === 'footer') {
      rightMargin       = Unit.multiply (m, -1);
      leftMargin        = Unit.multiply (m, -1);
      topMargin         = halfMargin;
      bottomMargin      = Unit.sub (Unit.multiply (halfMargin, -1), '1px');
      padding           = '0px';
    }
    if (inputSpacing === 'compact') {
      inputHeight      = theme.shapes.lineHeight;
      bottomMargin     = '0px';
    } else if (inputSpacing === 'glued') {
      inputHeight      = theme.shapes.lineHeight;
      bottomMargin     = Unit.multiply (halfMargin, -1);
    }
    margin = topMargin + ' ' + rightMargin + ' ' + bottomMargin + ' ' + leftMargin;
  }

  const boxStyle = {
    width:             inputWidth,
    height:            inputHeight,
    minWidth:          minWidth,
    minHeight:         minHeight,
    display:           display,
    overflowX:         overflowX,
    overflowY:         overflowY,
    flexDirection:     flexDirection,
    flexGrow:          flexGrow,
    flexShrink:        flexShrink,
    flexBasis:         flexBasis,
    justifyContent:    justifyContent,
    alignItems:        alignItems,
    alignContent:      alignContent,
    alignSelf:         alignSelf,
    borderWidth:       borderWidth,
    borderStyle:       borderStyle,
    borderColor:       borderColor,
    borderTopWidth:    borderTopWidth,
    borderTopStyle:    borderTopStyle,
    borderTopColor:    borderTopColor,
    borderRightWidth:  borderRightWidth,
    borderRightStyle:  borderRightStyle,
    borderRightColor:  borderRightColor,
    borderBottomWidth: borderBottomWidth,
    borderBottomStyle: borderBottomStyle,
    borderBottomColor: borderBottomColor,
    borderLeftWidth:   borderLeftWidth,
    borderLeftStyle:   borderLeftStyle,
    borderLeftColor:   borderLeftColor,
    borderRadius:      borderRadius,
    boxShadow:         boxShadow,
    margin:            margin,
    padding:           padding,
    backgroundColor:   backgroundColor,
    fontWeight:        fontWeight,
    zIndex:            zIndex,
    position:          position,
  };

  return {
    box: boxStyle,
  };
}

/******************************************************************************/
