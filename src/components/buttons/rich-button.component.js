'use strict';

import React from 'react';
import {Action, ColorManipulator} from 'electrum';
import * as Unit from '../unit-helpers.js';

const {fade, darken, lighten} = ColorManipulator;

/******************************************************************************/

export default class RichButton extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state, glyph, glyphPosition, size, rotate, flip, spin, text, border,
      spacing, grow, width, kind, active} = this.props;
    const disabled = Action.isDisabled (state);
    const inputGlyph         = glyph         || state.get ('glyph');
    const inputSize          = size          || state.get ('size');
    const inputRotate        = rotate        || state.get ('rotate');
    const inputFlip          = flip          || state.get ('flip');
    const inputSpin          = spin          || state.get ('spin');
    const inputText          = text          || state.get ('text');
    const inputBorder        = border        || state.get ('border');
    const inputGlyphPosition = glyphPosition || state.get ('glyphPosition');
    const inputSpacing       = spacing       || state.get ('spacing');
    const inputGrow          = grow          || state.get ('grow');
    const inputWidth         = width         || state.get ('width');
    const inputKind          = kind          || state.get ('kind');
    const inputActive        = active        || state.get ('active');

    const h = Theme.geometry.lineHeight;
    const m = Theme.geometry.containerMargin;
    const s = Theme.geometry.lineSpacing;

    // Initialize all variables for a standard button.
    var boxWidth             = inputWidth;
    var boxHeight            = null;
    var boxGrow              = inputGrow;
    var boxDirection         = 'row';
    var boxMargin            = '0px';
    var boxPadding           = '0px';
    var borderColor          = '#888';
    var borderStyle          = 'solid';
    var borderRadius         = '0px';
    var backgroundColor      = '#fff';
    var backgroundHoverColor = Theme.colors.hover;
    var glyphSize            = inputSize;
    var glyphColor           = '#555';
    var textColor            = '#222';
    var textMargin           = '0px ' + s + ' 0px ' + s;
    var textWeight           = null;
    var textTransform        = null;
    var textSize             = '100%';
    var textGrow             = 1;

    // Initialize variables for button without border.
    if (inputBorder === 'none') {
      // Button without border must have same backgroundColor as parent !
      borderStyle     = 'none';
      backgroundColor = null;
    }

    // Initialise right margin according to spacing.
    if (inputSpacing === 'overlap') {
      boxMargin = '0px -1px 0px 0px';
    } else if (inputSpacing === 'large') {
      boxMargin = '0px ' + s + ' 0px 0px';
    }

    // Decrease space between glyph and text.
    if (inputGlyph && inputText) {
      if (inputGlyphPosition === 'right') {
        textMargin = '0px 0px 0px ' + s;
      } else {
        textMargin = '0px ' + s + ' 0px 0px';
      }
    }

    // Logo button (usual parent container with kind="left").
    if (inputKind === 'logo') {
      boxWidth             = Theme.geometry.leftWidth;
      boxHeight            = '100px';
      boxDirection         = 'column';
      boxMargin            = '0px';
      borderStyle          = 'none';
      backgroundColor      = Theme.colors.pane;
      glyphSize            = '2x';
      textMargin           = '0px';
      textTransform        = 'uppercase';
      textWeight           = 'bold';
      textSize             = '125%';
      textGrow             = null;
    }

    // Left button (usual parent is container with kind="left").
    if (inputKind === 'left') {
      boxWidth             = Theme.geometry.leftWidth;
      boxHeight            = '100px';
      boxDirection         = 'column';
      boxMargin            = '0px';
      borderStyle          = 'none none solid none';
      borderColor          = darken (Theme.colors.base, 0.2);
      backgroundColor      = null;
      backgroundHoverColor = darken (Theme.colors.base, 0.2);
      glyphColor           = '#fff';
      textColor            = '#fff';
      textMargin           = '0px';
      textSize             = '80%';
      textGrow             = null;
    }

    // MainTab button (usual parent is container with kind="mainTab").
    if (inputKind === 'mainTab') {
      boxHeight       = Theme.geometry.mainTabHeight;
      boxMargin       = '0px 1px 0px 0px';
      borderStyle     = 'none';
      backgroundColor = lighten (Theme.colors.mainTab, 0.4);
      textTransform   = 'uppercase';
      textWeight      = 'bold';
      textSize        = '125%';
      if (inputActive === 'true') {
        backgroundColor = '#fff';
      }
    }

    // ViewTab button (usual parent is container with kind="viewTab").
    if (inputKind === 'viewTab') {
      boxHeight            = Theme.geometry.viewTabHeight;
      boxMargin            = '0px 1px 0px 0px';
      borderStyle          = 'none';
      textSize             = '80%';
      if (inputActive === 'true') {
        backgroundColor      = Theme.colors.view;
        glyphColor           = '#999';
        textColor            = '#222';
      } else {
        backgroundColor      = lighten (Theme.colors.viewTab, 0.1);
        backgroundHoverColor = darken (Theme.colors.viewTab, 0.2);
        glyphColor           = '#888';
        textColor            = '#aaa';
      }
    }

    // PaneNavigator button (usual parent is container with kind="paneNavigator").
    if (inputKind === 'paneNavigator') {
      boxHeight       = h;
      boxMargin       = '0px 0px -1px 0px';
      backgroundColor = null;
      textTransform   = 'uppercase';
      textWeight      = 'bold';
      if (inputActive === 'false') {
        borderStyle   = 'none';
        glyphColor    = '#aaa';
        textColor     = '#aaa';
      } else if (inputActive === 'true') {
        borderStyle   = 'none none solid none';
        borderColor   = '#000';
        glyphColor    = '#000';
        textColor     = '#000';
      }
    }

    // Footer button (usual parent is container with kind="footer").
    if (inputKind === 'footer') {
      boxHeight            = Theme.geometry.footerHeight;
      boxMargin            = '0px 1px 0px 0px';
      boxPadding           = '0px 20px 0px 20px';
      if (inputText) {
        backgroundColor      = lighten (Theme.colors.viewTab, 0.1);
        glyphSize            = '2x';
      } else {
        backgroundColor      = null;
      }
      backgroundHoverColor = darken (Theme.colors.viewTab, 0.2);
      borderStyle          = 'none';
      glyphColor           = '#aaa';
      textColor            = '#aaa';
    }

    // Action button (usual parent is container with kind="actions").
    if (inputKind && inputKind.startsWith ('action')) {
      const h = Theme.geometry.actionHeight;
      const d = Unit.multiply (h, 0.5);
      const m = Unit.multiply (h, 0.4);
      boxHeight            = h;
      boxPadding           = '0px ' + m + ' 0px ' + m;
      borderStyle          = 'none';
      backgroundColor      = Theme.colors.base;
      backgroundHoverColor = darken (Theme.colors.base, 0.2);
      glyphColor           = '#fff';
      textColor            = '#fff';
      if (inputKind === 'actionFirst') {
        boxMargin          = '0px 1px 0px 0px';
        borderRadius       = d + ' 0px 0px ' + d;
      } else if (inputKind === 'actionLast') {
        borderRadius       = '0px ' + d + ' ' + d + ' 0px';
      } else {
        boxMargin          = '0px 1px 0px 0px';
      }
    }

    if (disabled) {
      borderColor = '#aaa';
      if (backgroundColor) {
        backgroundColor = '#eee';
      }
      glyphColor    = '#aaa';
      textColor     = '#aaa';
    }

    var boxStyle = {
      width:           boxWidth,
      height:          boxHeight,
      display:         'flex',
      flexDirection:   boxDirection,
      flexGrow:        boxGrow,
      justifyContent:  'center',
      alignItems:      'center',
      borderWidth:     '1px',
      borderColor:     borderColor,
      borderStyle:     borderStyle,
      borderRadius:    borderRadius,
      padding:         boxPadding,
      margin:          boxMargin,
      backgroundColor: backgroundColor,
    };

    if (!disabled) {
      boxStyle[':hover'] = {
        backgroundColor: backgroundHoverColor,
        opacity:         1.0,
      };
    }

    var glyphDim = h;
    if (glyphSize === '2x') {
      glyphDim = Unit.multiply (glyphDim, 2.0);
    }

    var glyphStyle = {
      display:         'flex',
      flexDirection:   'row',
      justifyContent:  'center',
      alignItems:      'center',
      width:           glyphDim,
      height:          glyphDim,
      padding:         '0px',
      margin:          '0px',
      color:           glyphColor,
    };

    var textStyle = {
      display:         'flex',
      flexDirection:   'row',
      justifyContent:  'center',
      alignItems:      'center',
      flexGrow:        textGrow,
      height:          Theme.geometry.lineHeight,
      margin:          textMargin,
      color:           textColor,
      fontWeight:      textWeight,
      textTransform:   textTransform,
      fontSize:        Unit.multiply (textSize, Theme.geometry.fontScale),
    };

    const htmlText = (
      <label key='text' style={textStyle}>
        {inputText}
      </label>
    );

    const renderSpin = inputSpin ? 'fa-spin' : '';
    const htmlGlyph = (
      <i key='icon' style={glyphStyle}
        className={`fa
        fa-${inputGlyph}
        fa-${glyphSize}
        fa-rotate-${inputRotate}
        fa-flip-${inputFlip}
        ${renderSpin}`}
      />
    );

    const layout = () => {
      if (inputGlyph) {
        if (inputText) {
          if (inputGlyphPosition === 'right') {
            return [htmlText, htmlGlyph];
          } else {
            return [htmlGlyph, htmlText];
          }
        } else {
          return [htmlGlyph];
        }
      } else {
        return [htmlText];
      }
    };

    return (
      <div
        onClick={this.onClick}
        disabled={disabled}
        style={boxStyle}
        {...this.props}
        >
        {layout ().map ((comp) => comp)}
      </div>
    );
  }
}

/******************************************************************************/
