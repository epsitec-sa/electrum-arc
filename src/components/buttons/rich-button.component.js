'use strict';

import React from 'react';
import {Action} from 'electrum';
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
    var backgroundHoverColor = '#c4e6ff';
    var glyphColor           = '#555';
    var textColor            = '#222';
    var textMargin           = '0px 10px 0px 10px';
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
      boxMargin = '0px 10px 0px 0px';
    }

    // Decrease space between glyph and text.
    if (inputGlyph && inputText) {
      if (inputGlyphPosition === 'right') {
        textMargin = '0px 0px 0px 10px';
      } else {
        textMargin = '0px 10px 0px 0px';
      }
    }

    // Logo button (usual parent is LeftContainer).
    if (inputKind === 'logo') {
      boxWidth             = '80px';
      boxHeight            = '100px';
      boxDirection         = 'column';
      boxMargin            = '0px';
      borderStyle          = 'none';
      backgroundColor      = '#fff';
      textMargin           = '0px';
      textTransform        = 'uppercase';
      textWeight           = 'bold';
      textSize             = '125%';
      textGrow             = null;
    }

    // Left button (usual parent is LeftContainer).
    if (inputKind === 'left') {
      boxWidth             = '80px';
      boxHeight            = '100px';
      boxDirection         = 'column';
      boxMargin            = '0px';
      borderStyle          = 'none none solid none';
      borderColor          = '#24415f';
      backgroundColor      = null;
      backgroundHoverColor = '#24415f';
      glyphColor           = '#fff';
      textColor            = '#fff';
      textMargin           = '0px';
      textSize             = '80%';
      textGrow             = null;
    }

    // MainTab button (usual parent is MainTabContainer).
    if (inputKind === 'mainTab') {
      boxHeight       = '50px';
      boxMargin       = '0px 1px 0px 0px';
      borderStyle     = 'none';
      backgroundColor = '#ededed';
      textTransform   = 'uppercase';
      textWeight      = 'bold';
      textSize        = '125%';
      if (inputActive === 'true') {
        backgroundColor = '#fff';
      }
    }

    // ViewTab button (usual parent is MainTabContainer).
    if (inputKind === 'viewTab') {
      boxMargin       = '0px 1px 0px 0px';
      borderStyle     = 'none';
      backgroundColor = '#333';
      glyphColor      = '#888';
      textColor       = '#aaa';
      textSize        = '80%';
      if (inputActive === 'true') {
        backgroundColor = '#f5f5f5';
        glyphColor      = '#999';
        textColor       = '#222';
      }
    }

    // PageNavigator button (usual parent is PageNavigatorContainer).
    if (inputKind === 'pageNavigator') {
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

    // Action button (usual parent is ActionContainer).
    if (inputKind && inputKind.startsWith ('action')) {
      boxHeight            = '50px';
      boxPadding           = '0px 20px 0px 20px';
      borderStyle          = 'none';
      backgroundColor      = '#0d6396';
      backgroundHoverColor = '#11364c';
      glyphColor           = '#fff';
      textColor            = '#fff';
      if (inputKind === 'actionFirst') {
        boxMargin          = '0px 1px 0px 0px';
        borderRadius       = '25px 0px 0px 25px';
      } else if (inputKind === 'actionLast') {
        borderRadius       = '0px 25px 25px 0px';
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

    var glyphStyle = {
      display:         'flex',
      flexDirection:   'row',
      justifyContent:  'center',
      alignItems:      'center',
      width:           '32px',
      height:          '32px',
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
      height:          '32px',
      margin:          textMargin,
      color:           textColor,
      fontWeight:      textWeight,
      textTransform:   textTransform,
      fontSize:        textSize,
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
        fa-${inputSize}
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
