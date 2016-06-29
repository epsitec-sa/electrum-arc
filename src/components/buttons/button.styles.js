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
  const inputJustify       = props.justify;

  const m = Unit.multiply (theme.shapes.containerMargin, 0.5);

  // Initialize all variables for a standard button.
  let boxWidth             = inputWidth;
  let boxHeight            = theme.shapes.lineHeight;
  let boxGrow              = inputGrow;
  let boxDirection         = 'row';
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
  let textColor            = null;
  let textMargin           = '0px ' + m + ' 0px ' + m;
  let textJustify          = 'center';
  let textWeight           = null;
  let textTransform        = null;
  let textSize             = theme.shapes.buttonTextSize;
  let textGrow             = 1;
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

  // task-logo button (usual parent container with kind='task').
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

  // Task button (usual parent is container with kind='task').
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

  // Action button (usual parent is container with kind='actions').
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

  // Button with a day in Calendar component.
  if (inputKind  === 'calendar') {
    boxWidth        = theme.shapes.calendarButtonSize;
    boxHeight       = theme.shapes.calendarButtonSize;
    textSize        = theme.shapes.calendarTextSize;
    if (inputActive === 'true') {
      backgroundColor = theme.palette.calendarButtonActiveBackground;
      textColor       = theme.palette.calendarActiveText;
    } else if (inputActive === 'hidden') {
      backgroundColor = theme.palette.calendarBackground;
      borderColor     = 'transparent';
    } else {
      backgroundColor = theme.palette.calendarButtonInactiveBackground;
      textColor       = theme.palette.calendarInactiveText;
    }
    if (inputNature === 'weekend' && inputActive !== 'hidden') {
      backgroundColor = darken (backgroundColor, 0.1);
    }
  }
  // Button for month navigation in Calendar component.
  if (inputKind  === 'calendar-navigation') {
    boxWidth        = theme.shapes.calendarButtonSize;
    boxHeight       = theme.shapes.calendarButtonSize;
    borderColor     = 'transparent';
    backgroundColor = theme.palette.calendarBackground;
    glyphColor      = theme.palette.calendarHeaderText;
    glyphSize       = theme.palette.calendarGlyphSize;
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

  return {
    box:   boxStyle,
    glyph: glyphStyle,
    text:  textStyle,
  };
}

/******************************************************************************/
