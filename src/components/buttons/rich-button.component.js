'use strict';

import React from 'react';
import {Action, ColorManipulator} from 'electrum';
import {Unit} from 'electrum-theme';

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

    const m = Unit.multiply (theme.shapes.containerMargin, 0.5);

    // Initialize all variables for a standard button.
    var boxWidth        = inputWidth;
    var boxHeight       = theme.shapes.lineHeight;
    var boxGrow         = inputGrow;
    var boxDirection    = 'row';
    var boxMargin       = '0px';
    var boxPadding      = '0px';
    var borderColor     = theme.palette.buttonBorder;
    var borderStyle     = 'solid';
    var borderRadius    = '0px';
    var backgroundColor = theme.palette.buttonBackground;
    var glyphSize       = inputSize;
    var textMargin      = '0px ' + m + ' 0px ' + m;
    var textWeight      = null;
    var textTransform   = null;
    var textSize        = theme.shapes.buttonTextSize;
    var textGrow        = 1;
    var actif           = true;

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
      boxMargin = '0px ' + m + ' 0px 0px';
    }

    // Decrease space between glyph and text.
    if (inputGlyph && inputText) {
      if (inputGlyphPosition === 'right') {
        textMargin = '0px 0px 0px ' + m;
      } else {
        textMargin = '0px ' + m + ' 0px 0px';
      }
    }

    if (inputKind === 'label') {
      backgroundColor = theme.palette.labelButtonBackground;
      actif = false;
    }

    // TaskLogo button (usual parent container with kind="task").
    if (inputKind === 'taskLogo') {
      boxWidth        = theme.shapes.taskButtonWidth;
      boxHeight       = theme.shapes.taskButtonHeight;
      boxDirection    = 'column';
      boxMargin       = '0px';
      borderStyle     = 'none';
      backgroundColor = theme.palette.taskLogoBackground;
      glyphSize       = '2x';
      textMargin      = '0px';
      textTransform   = 'uppercase';
      textWeight      = 'bold';
      textSize        = theme.shapes.taskLogoTextSize;
      textGrow        = null;
    }

    // Task button (usual parent is container with kind="task").
    if (inputKind === 'task') {
      boxWidth        = theme.shapes.taskButtonWidth;
      boxHeight       = theme.shapes.taskButtonHeight;
      boxDirection    = 'column';
      boxMargin       = '0px';
      borderStyle     = 'none none solid none';
      borderColor     = theme.palette.taskButtonBorderColor;
      backgroundColor = theme.palette.taskButtonBackgroundColor;
      textMargin      = '0px';
      textSize        = theme.shapes.taskTextSize;
      textGrow        = null;
    }

    // MainTab button (usual parent is container with kind="mainTab").
    if (inputKind === 'mainTab') {
      boxHeight       = theme.shapes.mainTabHeight;
      boxMargin       = '0px 1px 0px 0px';
      borderStyle     = 'none';
      textTransform   = 'uppercase';
      textWeight      = 'bold';
      textSize        = theme.shapes.mainTabTextSize;
      if (inputActive === 'true') {
        backgroundColor = theme.palette.mainTabButtonActiveBackground;
      } else {
        backgroundColor = theme.palette.mainTabButtonInactiveBackground;
      }
    }

    // ViewTab button (usual parent is container with kind="viewTab").
    if (inputKind === 'viewTab') {
      boxHeight   = theme.shapes.viewTabHeight;
      boxMargin   = '0px 1px 0px 0px';
      borderStyle = 'none';
      textSize        = theme.shapes.viewTabTextSize;
      if (inputActive === 'true') {
        backgroundColor = theme.palette.viewTabButtonActiveBackground;
      } else {
        backgroundColor = theme.palette.viewTabButtonInactiveBackground;
      }
    }

    // PaneNavigator button (usual parent is container with kind="paneNavigator").
    if (inputKind === 'paneNavigator') {
      boxHeight       = theme.shapes.paneNavigatorHeight;
      boxMargin       = '0px 0px -1px 0px';
      backgroundColor = theme.palette.paneNavigatorBackground;
      textTransform   = 'uppercase';
      textWeight      = 'bold';
      borderStyle     = 'none none solid none';
      textSize        = theme.shapes.paneNavigatorTextSize;
      if (inputActive === 'false') {
        borderColor   = theme.palette.paneNavigatorInactiveBorder;
      } else if (inputActive === 'true') {
        borderColor   = theme.palette.paneNavigatorActiveBorder;
      }
    }

    // Footer button (usual parent is container with kind="footer").
    if (inputKind === 'footer') {
      boxHeight  = theme.shapes.footerHeight;
      boxMargin  = '0px 1px 0px 0px';
      boxPadding = '0px ' + m + ' 0px ' + m;
      textSize   = theme.shapes.footerTextSize;
      if (inputText) {
        backgroundColor = theme.palette.footerTextBackground;
        glyphSize       = '2x';
      } else {
        backgroundColor = theme.palette.footerBackground;
      }
      borderStyle = 'none';
    }

    // Action button (usual parent is container with kind="actions").
    if (inputKind && inputKind.startsWith ('action')) {
      const m = Unit.multiply (theme.shapes.actionHeight, 0.4);
      const r = theme.shapes.actionRadius;
      boxHeight       = theme.shapes.actionHeight;
      boxPadding      = '0px ' + m + ' 0px ' + m;
      borderStyle     = 'none';
      backgroundColor = theme.palette.actionButtonBackground;
      textSize        = theme.shapes.actionTextSize;
      if (inputKind === 'actionFirst') {
        boxMargin    = '0px 1px 0px 0px';
        borderRadius = r + ' 0px 0px ' + r;
      } else if (inputKind === 'actionLast') {
        borderRadius = '0px ' + r + ' ' + r + ' 0px';
      } else {
        boxMargin = '0px 1px 0px 0px';
      }
    }

    var c = backgroundColor;
    if (c === null) {
      c = theme.palette.buttonBackground;
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

    if (!disabled && actif) {
      boxStyle[':hover'] = {
        backgroundColor: backgroundHoverColor,
        opacity:         1.0,
      };
    }

    var glyphDim = theme.shapes.lineHeight;
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
