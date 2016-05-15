'use strict';

import React from 'react';
import {Action, ColorManipulator} from 'electrum';
import {Unit} from 'electrum-theme';
import {Badge} from 'electrum-arc';

const {fade, darken, lighten, emphasize} = ColorManipulator;

/******************************************************************************/

export default class Button extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state, theme} = this.props;
    const disabled = Action.isDisabled (state);
    const inputGlyph         = this.read ('glyph');
    const inputSize          = this.read ('size');
    const inputRotate        = this.read ('rotate');
    const inputFlip          = this.read ('flip');
    const inputSpin          = this.read ('spin');
    const inputText          = this.read ('text');
    const inputBorder        = this.read ('border');
    const inputGlyphPosition = this.read ('glyph-position');
    const inputSpacing       = this.read ('spacing');
    const inputGrow          = this.read ('grow');
    const inputWidth         = this.read ('width');
    const inputKind          = this.read ('kind');
    const inputPlace         = this.read ('place');
    const inputActive        = this.read ('active');
    const inputBadgeValue    = this.read ('badge-value');
    const inputJustify       = this.read ('justify');

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
    var textJustify     = 'center';
    var textWeight      = null;
    var textTransform   = null;
    var textSize        = theme.shapes.buttonTextSize;
    var textGrow        = 1;
    var actif           = true;
    var boxPosition     = null;

    // Initialize variables for button without border.
    if (inputBorder === 'none') {
      // Button without border must have same backgroundColor as parent !
      borderStyle     = 'none';
      backgroundColor = null;
    }

    // Initialise right margin according to spacing.
    if (inputSpacing) {
      var spacingType = {
        overlap: '0px -1px 0px 0px',
        tiny:    '0px 1px 0px 0px',
        large:   '0px ' + m + ' 0px 0px',
      };
      boxMargin = spacingType[inputSpacing];
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

    if (inputJustify) {
      const justifyType = {
        left:  'flex-start',
        right: 'flex-end',
      };
      textJustify = inputJustify && justifyType[inputJustify];
    }

    // task-logo button (usual parent container with kind="task").
    if (inputKind === 'task-logo') {
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
      textJustify     = 'center';
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

    // main-tab button (usual parent is container with kind="main-tab").
    if (inputKind === 'main-tab') {
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

    // view-tab button (usual parent is container with kind="view-tab").
    if (inputKind === 'view-tab') {
      boxHeight   = theme.shapes.viewTabHeight;
      borderStyle = 'none';
      textSize        = theme.shapes.viewTabTextSize;
      if (inputActive === 'true') {
        backgroundColor = theme.palette.viewTabButtonActiveBackground;
      } else {
        backgroundColor = theme.palette.viewTabButtonInactiveBackground;
      }
    }

    // pane-navigator button (usual parent is container with kind="pane-navigator").
    if (inputKind === 'pane-navigator') {
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
    if (inputKind  === 'action') {
      const m = Unit.multiply (theme.shapes.actionHeight, 0.4);
      const r = theme.shapes.actionRadius;
      boxHeight       = theme.shapes.actionHeight;
      boxPadding      = '0px ' + m + ' 0px ' + m;
      borderStyle     = 'none';
      backgroundColor = theme.palette.actionButtonBackground;
      textSize        = theme.shapes.actionTextSize;
      if (inputPlace === 'left') {
        boxMargin    = '0px 1px 0px 0px';
        borderRadius = r + ' 0px 0px ' + r;
      } else if (inputPlace === 'right') {
        borderRadius = '0px ' + r + ' ' + r + ' 0px';
      } else {
        boxMargin = '0px 1px 0px 0px';
      }
    }

    // If Button has a Badge, place it on top-right corner.
    if (inputBadgeValue) {
      boxPosition = 'relative';
    }

    // Compute colors for glyph, text and hover.
    var c = backgroundColor;
    if (!c) {
      c = theme.palette.buttonBackground;
    }
    var backgroundHoverColor = emphasize (c, 0.2);
    var glyphColor           = emphasize (c, 0.8);
    var textColor            = emphasize (c, 0.9);

    // Alter colors if component is disable.
    if (disabled) {
      borderColor = '#aaa';
      if (backgroundColor) {
        backgroundColor = '#eee';
      }
      glyphColor    = '#aaa';
      textColor     = '#aaa';
    }

    // If component has specific width and border, reduce the width to
    // take into account the thickness of the borders left and right.
    // Buttons without left or right border (with only bottom border) are
    // considered as without border (for example task button).
    if (boxWidth && boxWidth !== '0px' && !borderStyle.startsWith ('none')) {
      boxWidth = Unit.sub (boxWidth, '2px');
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
      position:        boxPosition,
    };

    if (!disabled && actif) {
      boxStyle.transitionProperty = 'background-color';
      boxStyle.transitionDuration = '300ms';
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
      justifyContent:  textJustify,
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
      <i key='icon'
        style={glyphStyle}
        className={`fa
        fa-${inputGlyph}
        fa-${glyphSize}
        fa-rotate-${inputRotate}
        fa-flip-${inputFlip}
        ${renderSpin}`}
      />
    );

    const htmlBadge = inputBadgeValue ? (
      <Badge
        value={inputBadgeValue}
        layer='over'
        {...this.link ()}
      />
    ) : null;

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
        {htmlBadge}
      </div>
    );
  }
}

/******************************************************************************/
