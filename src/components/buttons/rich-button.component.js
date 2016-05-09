'use strict';

import React from 'react';
import {Action, ColorManipulator} from 'electrum';
import * as Unit from '../unit-helpers.js';

const {fade, darken, lighten, emphasize} = ColorManipulator;

/******************************************************************************/

export default class RichButton extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state, theme, glyph, glyphPosition, size, rotate, flip, spin, text, border,
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

    const h = theme.shapes.lineHeight;
    const s = theme.shapes.lineSpacing;

    // Initialize all variables for a standard button.
    var boxWidth        = inputWidth;
    var boxHeight       = null;
    var boxGrow         = inputGrow;
    var boxDirection    = 'row';
    var boxMargin       = '0px';
    var boxPadding      = '0px';
    var borderColor     = lighten (theme.palette.dark, 0.5);
    var borderStyle     = 'solid';
    var borderRadius    = '0px';
    var backgroundColor = lighten (theme.palette.light, 0.5);
    var glyphSize       = inputSize;
    var textMargin      = '0px ' + s + ' 0px ' + s;
    var textWeight      = null;
    var textTransform   = null;
    var textSize        = '100%';
    var textGrow        = 1;

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
      boxWidth        = Unit.multiply (theme.shapes.lineHeight, 2.5);
      boxHeight       = '100px';
      boxDirection    = 'column';
      boxMargin       = '0px';
      borderStyle     = 'none';
      backgroundColor = theme.palette.light;
      glyphSize       = '2x';
      textMargin      = '0px';
      textTransform   = 'uppercase';
      textWeight      = 'bold';
      textSize        = '125%';
      textGrow        = null;
    }

    // Left button (usual parent is container with kind="left").
    if (inputKind === 'left') {
      boxWidth        = Unit.multiply (theme.shapes.lineHeight, 2.5);
      boxHeight       = '100px';
      boxDirection    = 'column';
      boxMargin       = '0px';
      borderStyle     = 'none none solid none';
      borderColor     = darken (theme.palette.base, 0.3);
      backgroundColor = theme.palette.base;
      textMargin      = '0px';
      textSize        = '80%';
      textGrow        = null;
    }

    // MainTab button (usual parent is container with kind="mainTab").
    if (inputKind === 'mainTab') {
      boxHeight       = Unit.multiply (theme.shapes.lineHeight, 1.5);
      boxMargin       = '0px 1px 0px 0px';
      borderStyle     = 'none';
      textTransform   = 'uppercase';
      textWeight      = 'bold';
      textSize        = '125%';
      if (inputActive === 'true') {
        backgroundColor = theme.palette.light;
      } else {
        backgroundColor = darken (theme.palette.light, 0.1);
      }
    }

    // ViewTab button (usual parent is container with kind="viewTab").
    if (inputKind === 'viewTab') {
      boxHeight   = Unit.multiply (theme.shapes.lineHeight, 1.0);
      boxMargin   = '0px 1px 0px 0px';
      borderStyle = 'none';
      textSize    = '80%';
      if (inputActive === 'true') {
        backgroundColor = darken (theme.palette.light, 0.05);
      } else {
        backgroundColor = lighten (theme.palette.dark, 0.2);
      }
    }

    // PaneNavigator button (usual parent is container with kind="paneNavigator").
    if (inputKind === 'paneNavigator') {
      boxHeight       = h;
      boxMargin       = '0px 0px -1px 0px';
      backgroundColor = darken (theme.palette.light, 0.05);
      textTransform   = 'uppercase';
      textWeight      = 'bold';
      borderStyle     = 'none none solid none';
      if (inputActive === 'false') {
        borderColor   = emphasize (theme.palette.dark, 0.8);
      } else if (inputActive === 'true') {
        borderColor   = lighten (theme.palette.dark, 0.2);
      }
    }

    // Footer button (usual parent is container with kind="footer").
    if (inputKind === 'footer') {
      boxHeight  = Unit.multiply (theme.shapes.lineHeight, 2.0);
      boxMargin  = '0px 1px 0px 0px';
      boxPadding = '0px 20px 0px 20px';
      if (inputText) {
        backgroundColor = lighten (theme.palette.dark, 0.1);
        glyphSize       = '2x';
      } else {
        backgroundColor = theme.palette.dark;
      }
      borderStyle = 'none';
    }

    // Action button (usual parent is container with kind="actions").
    if (inputKind && inputKind.startsWith ('action')) {
      const h = Unit.multiply (theme.shapes.lineHeight, 1.5);
      const d = Unit.multiply (h, 0.5);
      const m = Unit.multiply (h, 0.4);
      boxHeight       = h;
      boxPadding      = '0px ' + m + ' 0px ' + m;
      borderStyle     = 'none';
      backgroundColor = theme.palette.base;
      if (inputKind === 'actionFirst') {
        boxMargin    = '0px 1px 0px 0px';
        borderRadius = d + ' 0px 0px ' + d;
      } else if (inputKind === 'actionLast') {
        borderRadius = '0px ' + d + ' ' + d + ' 0px';
      } else {
        boxMargin = '0px 1px 0px 0px';
      }
    }

    var c = backgroundColor;
    if (c === null) {
      c = lighten (theme.palette.light, 0.5);
    }
    var backgroundHoverColor = darken    (c, 0.1);
    var glyphColor           = emphasize (c, 0.8);
    var textColor            = emphasize (c, 0.9);

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
      height:          h,
      margin:          textMargin,
      color:           textColor,
      fontWeight:      textWeight,
      textTransform:   textTransform,
      fontSize:        Unit.multiply (textSize, theme.typo.fontScale),
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
