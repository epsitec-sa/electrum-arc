'use strict';

import {Action, ColorManipulator} from 'electrum';
import {Unit} from 'electrum-theme';

const {darken, emphasize} = ColorManipulator;

/******************************************************************************/

export default function styles (theme, props) {
  const {state} = props;
  const disabled = Action.isDisabled (state);
  const inputGlyph         = props.glyph;
  const inputText          = props.text;
  const inputBorder        = props.border;
  const inputGlyphPosition = props.glyphPosition;
  const inputSpacing       = props.spacing;
  const inputGrow          = props.grow;
  const inputWidth         = props.width;
  const inputKind          = props.kind;
  const inputNature        = props.nature;
  const inputPlace         = props.place;
  const inputActive        = props.active;
  const inputShape         = props.shape;
  const inputMenuDirection = props.menuDirection;

  const m = Unit.multiply (theme.shapes.containerMargin, 0.5);

  // Initialize all variables for a standard button.
  let boxWidth             = inputWidth;
  let boxHeight            = theme.shapes.lineHeight;
  let boxGrow              = inputGrow;
  let boxDirection         = 'row';
  let boxJustifyContent    = 'center';
  let boxMargin            = '0px';
  let boxPadding           = '0px';
  let borderColor          = theme.palette.buttonBorder;
  let borderStyle          = 'solid';
  let borderRadius         = '0px';
  let backgroundColor      = theme.palette.buttonBackground;
  let borderHoverColor     = null;
  let backgroundHoverColor = null;
  let glyphColor           = null;
  let glyphSize            = null;
  let textWidth            = null;
  let textGrow             = null;
  let textColor            = null;
  let textMargin           = '0px ' + m + ' 0px ' + m;
  let textWeight           = null;
  let textTransform        = null;
  let textSize             = theme.shapes.buttonTextSize;
  let actif                = true;
  let boxPosition          = 'relative';

  // Initialize variables for button without border.
  if (inputBorder === 'none') {
    // Button without border must have same backgroundColor as parent !
    borderStyle     = 'none';
    backgroundColor = null;
  }

  // Initialise right margin according to spacing.
  if (inputSpacing) {
    let spacingType = {
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
      if (inputWidth) {
        // A button with text and glyph (in this order) and a specific width must
        // have a text push to left border and glyph push to right border:
        // |text........glyph|
        // |<-----width----->|
        textGrow = '1';
      }
    } else {
      textMargin = '0px ' + m + ' 0px 0px';
    }
  }

  if (inputKind === 'label') {
    backgroundColor = theme.palette.labelButtonBackground;
    actif = false;
  }

  // task-logo button (usual parent container with kind='task').
  if (inputKind === 'task-logo') {
    boxHeight       = theme.shapes.taskButtonHeight;
    boxDirection    = 'column';
    boxMargin       = '0px';
    borderStyle     = 'none';
    backgroundColor = theme.palette.taskLogoBackground;
    textMargin      = '0px';
    textTransform   = 'uppercase';
    textWeight      = 'bold';
    textSize        = theme.shapes.taskLogoTextSize;
    glyphSize       = theme.shapes.taskLogoGlyphSize;
  }

  // Task button (usual parent is container with kind='task').
  if (inputKind === 'task') {
    boxHeight       = theme.shapes.taskButtonHeight;
    boxDirection    = 'column';
    boxMargin       = '0px';
    borderStyle     = 'none none solid none';
    borderColor     = theme.palette.taskButtonBorder;
    backgroundColor = theme.palette.taskButtonBackground;
    textMargin      = '0px';
    textSize        = theme.shapes.taskTextSize;
    glyphSize       = theme.shapes.taskGlyphSize;
  }

  // main-tab button (usual parent is container with kind='main-tab').
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
    textColor = theme.palette.mainTabText;
  }

  if (inputKind === 'main-tab-identity') {
    boxHeight            = theme.shapes.mainTabHeight;
    borderStyle          = 'none';
    textColor            = theme.palette.mainTabText;
    backgroundColor      = null;
    backgroundHoverColor = theme.palette.mainTabButtonActiveBackground;
  }

  // view-tab button (usual parent is container with kind='view-tab').
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

  // task-tab button (usual parent is container with kind='task').
  if (inputKind === 'task-tab') {
    boxHeight         = theme.shapes.taskTabHeight;
    boxJustifyContent = 'flex-start';
    if (inputActive === 'true') {
      backgroundColor = theme.palette.taskTabActiveBackground;
      textColor       = theme.palette.taskTabActiveText;
      textWeight      = 'bold';
    } else {
      backgroundColor = theme.palette.taskTabInactiveBackground;
      textColor       = theme.palette.taskTabInactiveText;
    }
    boxMargin       = '0px';
    borderStyle     = 'none none solid none';
    borderColor     = theme.palette.taskButtonBorder;
    const mm = inputGlyph ? '0px' : theme.shapes.taskTabLeftMargin;
    textMargin      = '0px 0px 0px ' + mm;
    textSize        = theme.shapes.taskTabTextSize;
    glyphSize       = theme.shapes.taskTabGlyphSize;
  }

  // pane-navigator button (usual parent is container with kind='pane-navigator').
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

  // pane-hnavigator button (usual parent is container with kind='pane-hnavigator').
  if (inputKind === 'pane-hnavigator') {
    boxHeight       = theme.shapes.paneNavigatorHeight;
    boxMargin       = '0px 0px -1px 0px';
    backgroundColor = theme.palette.paneNavigatorBackground;
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

  // pane-vnavigator button (usual parent is container with kind='pane-vnavigator').
  if (inputKind === 'pane-vnavigator') {
    boxWidth        = theme.shapes.vnavigatorButtonSize;
    boxHeight       = theme.shapes.vnavigatorButtonSize;
    boxMargin       = '0px 0px 1px 0px';
    borderStyle     = 'none';
    textSize        = theme.shapes.paneNavigatorTextSize;
    if (inputActive === 'false') {
      backgroundColor = theme.palette.vnavigatorButtonInactiveBackground;
    } else if (inputActive === 'true') {
      backgroundColor = theme.palette.vnavigatorButtonActiveBackground;
    }
  }

  // Footer button (usual parent is container with kind='footer').
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

  // Warning button (usual parent is container with kind='footer').
  if (inputKind === 'warning') {
    boxHeight       = theme.shapes.footerHeight;
    boxPadding      = '0px 0px 0px ' + theme.shapes.warningLeftPadding;
    textWeight      = 'bold';
    borderStyle     = 'none';
    textSize        = theme.shapes.warningTextSize;
    glyphSize       = theme.shapes.warningGlyphSize;
    backgroundColor = theme.palette.warningBackground;
    textColor       = theme.palette.warningText;
  }

  // Action button (usual parent is container with kind='actions').
  if (inputKind  === 'action') {
    const m = Unit.multiply (theme.shapes.actionHeight, 0.1);
    const r = theme.shapes.actionRadius;
    boxHeight       = theme.shapes.actionHeight;
    boxPadding      = '0px 0px 0px ' + m;
    borderStyle     = 'none';
    boxJustifyContent = null;
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

  // Subaction button (usual parent is container with kind='row-pane' and subkind='box').
  if (inputKind  === 'subaction') {
    borderStyle     = 'none';
    backgroundColor = theme.palette.subactionButtonBackground;
    textColor       = theme.palette.subactionButtonText;
    textSize        = theme.shapes.subactionTextSize;
    textTransform   = 'uppercase';
    textWeight      = 'bold';
  }

  // Combo button, place to the right of a TextFieldCombo component.
  if (inputKind  === 'combo') {
    if (inputActive === 'true') {
      backgroundColor = theme.palette.comboActiveBackground;
      glyphColor      = theme.palette.comboActiveGlyph;
    }
  }

  if (inputKind  === 'round') {
    const r = theme.shapes.actionRadius;
    borderRadius    = r;
    borderStyle     = 'none';
    backgroundColor = theme.palette.roundButtonBackground;
    textColor       = theme.palette.roundButtonText;
    glyphColor      = theme.palette.roundButtonGlyph;
  }

  if (inputKind  === 'identity') {
    const r = theme.shapes.actionRadius;
    boxWidth        = theme.shapes.identityHeight;
    boxHeight       = theme.shapes.identityHeight;
    borderRadius    = r;
    glyphSize       = theme.shapes.identityGlyphSize;
    borderStyle     = 'none';
    backgroundColor = theme.palette.identityButtonBackground;
    textColor       = theme.palette.identityButtonText;
    glyphColor      = theme.palette.identityButtonGlyph;
  }

  if (inputKind  === 'frameless') {
    borderStyle     = 'none';
  }

  if (inputKind  === 'menu-item') {
    textWidth         = 'max-content';
    boxHeight         = theme.shapes.menuButtonHeight;
    boxMargin         = '0px 0px 1px 0px';
    boxPadding        = '0px ' + theme.shapes.containerMargin + ' 0px ' + theme.shapes.containerMargin;
    textMargin        = '0px ' + theme.shapes.containerMargin + ' 0px ' + theme.shapes.containerMargin;
    boxJustifyContent = 'flex-start';
    textSize          = theme.shapes.menuTextSize;
    textTransform     = 'uppercase';
    textWeight        = 'bold';
    borderStyle       = 'none';
    backgroundColor   = theme.palette.menuItemBackground;
  }

  // Button with a day in Calendar component.
  if (inputKind  === 'calendar') {
    borderStyle     = 'none';
    boxWidth        = theme.shapes.calendarButtonWidth;
    boxHeight       = theme.shapes.calendarButtonHeight;
    textSize        = theme.shapes.calendarTextSize;
    if (inputActive === 'true') {
      backgroundColor = theme.palette.calendarButtonActiveBackground;
      textColor       = theme.palette.calendarActiveText;
    } else if (inputActive === 'hidden') {
      backgroundColor = theme.palette.calendarBackground;
      textColor       = theme.palette.calendarHiddenText;
    } else {
      backgroundColor = theme.palette.calendarButtonInactiveBackground;
      textColor       = theme.palette.calendarInactiveText;
    }
    if (inputNature === 'weekend' && inputActive !== 'hidden') {
      backgroundColor = theme.palette.calendarButtonWeekendBackground;
    } else {
      const mm = Unit.multiply (Unit.sub (theme.shapes.calendarButtonWidth, theme.shapes.calendarButtonHeight), 0.5);
      boxMargin       = '0px ' + mm;
      borderRadius    = Unit.multiply (theme.shapes.calendarButtonHeight, 0.5);
      boxWidth        = theme.shapes.calendarButtonHeight;
    }
  }
  // Button for month navigation in Calendar component.
  if (inputKind  === 'calendar-navigation') {
    boxWidth        = theme.shapes.calendarButtonWidth;
    boxHeight       = theme.shapes.calendarButtonHeight;
    borderColor     = 'transparent';
    backgroundColor = theme.palette.calendarBackground;
    glyphColor      = theme.palette.calendarHeaderText;
    glyphSize       = theme.palette.calendarGlyphSize;
  }

  if (inputKind  === 'container') {
    boxHeight       = null;
    borderStyle     = 'none';
    boxPadding      = Unit.multiply (theme.shapes.lineSpacing, 0.5) + ' 0px';
    backgroundColor = null;
  }

  if (!inputKind) {
    borderRadius = theme.shapes.smoothRadius;
  }

  if (inputShape) {
    const r = Unit.multiply (theme.shapes.lineHeight, 0.5);
    const s = theme.shapes.smoothRadius;
    if (inputShape === 'left-rounded') {
      borderRadius = r + ' 0px 0px ' + r;
    } else if (inputShape === 'right-rounded') {
      borderRadius = '0px ' + r + ' ' + r + ' 0px';
    } else if (inputShape === 'left-smooth') {
      borderRadius = s + ' 0px 0px ' + s;
    } else if (inputShape === 'right-smooth') {
      borderRadius = '0px ' + s + ' ' + s + ' 0px';
    }
  }

  // Compute colors for glyph, text and hover if necessary.
  let buttonBackgroundColor = backgroundColor;
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

  let boxStyle = {
    width:           boxWidth,
    height:          boxHeight,
    display:         'flex',
    flexDirection:   boxDirection,
    flexGrow:        boxGrow,
    justifyContent:  boxJustifyContent,
    alignItems:      'center',
    borderWidth:     '1px',
    borderColor:     borderColor,
    borderStyle:     borderStyle,
    borderRadius:    borderRadius,
    padding:         boxPadding,
    margin:          boxMargin,
    backgroundColor: backgroundColor,
    position:        boxPosition,
    transition:      theme.transitions.easeOut (),
  };

  if (!disabled && actif) {
    boxStyle[':hover'] = {
      borderColor:     borderHoverColor,
      backgroundColor: backgroundHoverColor,
      opacity:         1.0,
    };
  }

  let glyphTransform = null;
  let glyphMargin    = '0px';
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

  const glyphStyle = {
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

  const textStyle = {
    width:           textWidth,
    margin:          textMargin,
    flexGrow:        textGrow,
    color:           textColor,
    fontWeight:      textWeight,
    textTransform:   textTransform,
    fontSize:        Unit.multiply (textSize, theme.typo.fontScale),
    overflow:        'hidden',
    textOverflow:    'ellipsis',
    whiteSpace:      'nowrap',
    wordWrap:        'break-word',
  };

  // Generate a triangle with subtle css, see:
  // https://css-tricks.com/snippets/css/css-triangle/
  const d = theme.shapes.mainTabTriangleSize;
  const triangleStyle = {
    position:     'absolute',
    right:        '50%',
    bottom:       '0px',
    borderLeft:   d + ' solid transparent',
    borderRight:  d + ' solid transparent',
    borderBottom: d + ' solid ' + theme.palette.viewTabBackground,
    margin:       '0px -' + d + ' 0px 0px',
  };

  const menuBoxStyle = {
    position:        'absolute',
    top:             (inputMenuDirection === 'top') ? null : boxHeight,
    bottom:          (inputMenuDirection === 'top') ? boxHeight : null,
    padding:         '1px 0px 1px 0px',
    left:            '0px',
    backgroundColor: theme.palette.menuBackground,
    zIndex:          2,
  };

  return {
    box:      boxStyle,
    glyph:    glyphStyle,
    text:     textStyle,
    triangle: triangleStyle,
    menuBox:  menuBoxStyle,
  };
}

/******************************************************************************/
