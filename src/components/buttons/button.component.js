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
    var boxWidth             = inputWidth;
    var boxHeight            = theme.shapes.lineHeight;
    var boxGrow              = inputGrow;
    var boxDirection         = 'row';
    var boxMargin            = '0px';
    var boxPadding           = '0px';
    var borderColor          = theme.palette.buttonBorder;
    var borderStyle          = 'solid';
    var borderRadius         = '0px';
    var backgroundColor      = theme.palette.buttonBackground;
    var borderHoverColor     = null;
    var backgroundHoverColor = null;
    var glyphColor           = null;
    var glyphSize            = null;
    var textColor            = null;
    var textMargin           = '0px ' + m + ' 0px ' + m;
    var textJustify          = 'center';
    var textWeight           = null;
    var textTransform        = null;
    var textSize             = theme.shapes.buttonTextSize;
    var textGrow             = 1;
    var actif                = true;
    var boxPosition          = null;
    var hasBottomTriangle    = false;

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
      textMargin      = '0px';
      textTransform   = 'uppercase';
      textWeight      = 'bold';
      textSize        = theme.shapes.taskLogoTextSize;
      textJustify     = 'center';
      textGrow        = null;
      glyphSize       = theme.shapes.taskLogoGlyphSize;
    }

    // Task button (usual parent is container with kind="task").
    if (inputKind === 'task') {
      boxWidth        = theme.shapes.taskButtonWidth;
      boxHeight       = theme.shapes.taskButtonHeight;
      boxDirection    = 'column';
      boxMargin       = '0px';
      borderStyle     = 'none none solid none';
      borderColor     = theme.palette.taskButtonBorder;
      backgroundColor = theme.palette.taskButtonBackground;
      textMargin      = '0px';
      textSize        = theme.shapes.taskTextSize;
      textGrow        = null;
      glyphSize       = theme.shapes.taskGlyphSize;
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
        boxPosition     = 'relative';
        hasBottomTriangle = true;
      } else {
        backgroundColor = theme.palette.mainTabButtonInactiveBackground;
      }
      textColor = theme.palette.mainTabText;
    }

    // view-tab button (usual parent is container with kind="view-tab").
    if (inputKind === 'view-tab') {
      boxHeight   = theme.shapes.viewTabHeight;
      borderStyle = 'none';
      textSize    = theme.shapes.viewTabTextSize;
      glyphColor  = theme.palette.viewTabGlyph;
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
        textColor     = theme.palette.paneNavigatorInactiveText;
      } else if (inputActive === 'true') {
        borderColor   = theme.palette.paneNavigatorActiveBorder;
      }
      borderHoverColor = theme.palette.paneNavigatorBorderHover;
      backgroundHoverColor = '#ffffff00';  // transparent
    }

    // Footer button (usual parent is container with kind="footer").
    if (inputKind === 'footer') {
      boxHeight  = theme.shapes.footerHeight;
      boxMargin  = '0px 1px 0px 0px';
      boxPadding = '0px ' + m + ' 0px ' + m;
      textSize   = theme.shapes.footerTextSize;
      glyphSize  = theme.shapes.footerGlyphSize;
      if (inputText) {
        backgroundColor = theme.palette.footerTextBackground;
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
      glyphSize       = theme.shapes.actionGlyphSize;
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

    // Compute colors for glyph, text and hover if necessary.
    var buttonBackgroundColor = backgroundColor;
    if (!buttonBackgroundColor) {
      buttonBackgroundColor = theme.palette.buttonBackground;
    }
    if (!backgroundHoverColor) {
      backgroundHoverColor = emphasize (buttonBackgroundColor, 0.2);
    }
    if (!glyphColor) {
      glyphColor = emphasize (buttonBackgroundColor, 0.8);
    }
    if (!textColor) {
      textColor = emphasize (buttonBackgroundColor, 0.9);
    }

    // Alter colors if component is disable.
    if (disabled) {
      borderColor = theme.palette.buttonDisableBorder;
      if (backgroundColor) {
        backgroundColor = theme.palette.buttonDisableBackground;
      }
      glyphColor = theme.palette.buttonDisableGlyph;
      textColor  = theme.palette.buttonDisableText;
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
      boxStyle[':hover'] = {
        borderColor:              borderHoverColor,
        backgroundColor:          backgroundHoverColor,
        opacity:                  1.0,
        transitionProperty:       'all',
        transitionDuration:       '200ms',
        transitionTimingFunction: 'ease-out',
      };
    }

    var glyphTransform = null;
    var glyphMargin    = '0px';
    if (glyphSize) {
      const s = Unit.parse (glyphSize);
      if (s.unit !== '%') {
        throw new Error (`GlyphSize '${glyphSize}' has an unexpected format`);
      }
      const ss = s.value / 100;
      glyphTransform = 'scale(' + ss + ')';
      const mm = Unit.multiply (m, ss);
      glyphMargin = '0px ' + mm + ' 0px ' + mm;
    }

    var glyphStyle = {
      display:         'flex',
      flexDirection:   'row',
      justifyContent:  'center',
      alignItems:      'center',
      width:           theme.shapes.lineHeight,
      height:          theme.shapes.lineHeight,
      padding:         '0px',
      margin:          glyphMargin,
      color:           glyphColor,
      transform:       glyphTransform,
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

    var htmlTriangle = null;
    if (hasBottomTriangle) {
      const triangleStyle = {
        position: 'absolute',
        right:    '0px',
        top:      '0px',
      };
      const w  = boxWidth;
      const h  = boxHeight;
      const d  = theme.shapes.mainTabTriangleSize;
      const x2 = Unit.multiply (w, 0.5);
      const x1 = Unit.sub (x2, d);
      const y2 = Unit.sub (h,  d);
      const x3 = Unit.add (x2, d);
      const p  = (x1 + h + x2 + y2 + x3 + h).replace (/px/g, ' ');
      htmlTriangle = (
        <svg width={w} height={h} style={triangleStyle}>
          <polygon points={p} fill={theme.palette.viewTabBackground}/>
        </svg>
      );
    }

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
        {htmlTriangle}
        {htmlBadge}
      </div>
    );
  }
}

/******************************************************************************/
