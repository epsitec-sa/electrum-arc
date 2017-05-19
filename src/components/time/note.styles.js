import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, _props) {
  const m = theme.shapes.containerMargin;
  const halfMargin = Unit.multiply (m, 0.5);

  const mainCompactedStyle = {
    display:         'flex',
    flexDirection:   'column',
    flexGrow:        '1',
    padding:         halfMargin + ' ' + m,
    borderTopColor:  theme.palette.paneNavigatorInactiveBorder,
    borderTopWidth:  '1px',
    borderTopStyle:  'solid',
    backgroundColor: 'transparent',
    color:           theme.palette.recurrenceHeaderInfoCompactedText,
    transition:      theme.transitions.easeOut (500, 'background-color', 0),
    cursor:          'default',
    userSelect:      'none',
  };

  const mainExtendedStyle = {
    display:         'flex',
    flexDirection:   'column',
    flexGrow:        '1',
    padding:         halfMargin + ' ' + m,
    borderTopColor:  theme.palette.paneNavigatorInactiveBorder,
    borderTopWidth:  '1px',
    borderTopStyle:  'solid',
    backgroundColor: theme.palette.recurrenceExtendedBoxBackground,
    color:           theme.palette.recurrenceHeaderInfoExtendedText,
    transition:      theme.transitions.easeOut (500, 'background-color', 0),
    cursor:          'default',
    userSelect:      'none',
  };

  const headerInfoStyle = {
    display:       'flex',
    flexDirection: 'row',
  };

  const headerDragStyle = {
    display:       'flex',
    flexDirection: 'row',
    flexGrow:      '1',
    cursor:        'ns-resize',
  };

  const editorStyle = {
    display:       'flex',
    flexDirection: 'row',
    overflowY:     'hidden',
    padding:       halfMargin + ' 0px',
  };

  const glyphsStyle = {
    display:       'flex',
    flexDirection: 'row',
    overflowY:     'hidden',
    margin:        '0px ' + m,
  };

  return {
    mainCompacted: mainCompactedStyle,
    mainExtended:  mainExtendedStyle,
    headerInfo:    headerInfoStyle,
    headerDrag:    headerDragStyle,
    editor:        editorStyle,
    glyphs:        glyphsStyle,
  };
}

/******************************************************************************/
