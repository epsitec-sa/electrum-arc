import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, _props) {
  const s = theme.shapes.lineSpacing;
  const editorHeight = Unit.add (theme.shapes.lineHeight, '2px');

  const mainStyle = {
    display:       'flex',
    flexDirection: 'column',
    cursor:        'default',
    userSelect:    'none',
  };

  const headerInfoCompactedStyle = {
    display:         'flex',
    flexDirection:   'row',
    backgroundColor: theme.palette.recurrenceHeaderInfoCompactedBackground,
    color:           theme.palette.recurrenceHeaderInfoCompactedText,
    transition:      theme.transitions.easeOut (500, 'background-color', 0),
  };

  const headerInfoExtendedStyle = {
    display:         'flex',
    flexDirection:   'row',
    backgroundColor: theme.palette.recurrenceHeaderInfoExtendedBackground,
    color:           theme.palette.recurrenceHeaderInfoExtendedText,
    transition:      theme.transitions.easeOut (500, 'background-color', 0),
  };

  const headerEditorStyle = {
    display:       'flex',
    flexDirection: 'row-reverse',
  };

  const compactedBoxStyle = {
    display:         'flex',
    flexDirection:   'column',
    height:          '0px',
    overflowY:       'hidden',
    margin:          '0px 0px ' + s + ' 0px',
    backgroundColor: 'transparent',
    transition:      theme.transitions.easeOut (500),
  };

  const extendedBoxStyle = {
    display:         'flex',
    flexDirection:   'column',
    // height:          extendedBoxHeight,
    overflowY:       'hidden',
    margin:          '0px 0px ' + s + ' 0px',
    backgroundColor: theme.palette.recurrenceExtendedBoxBackground,
    transition:      theme.transitions.easeOut (500),
  };

  const editorStyle = {
    minHeight:     editorHeight,
    padding:       s,
    display:       'flex',
    flexDirection: 'row',
  };

  const glyphsStyle = {
    padding: '0px ' + '54px' + ' ' + s + ' ' + s,
  };

  return {
    main:                mainStyle,
    headerInfoCompacted: headerInfoCompactedStyle,
    headerInfoExtended:  headerInfoExtendedStyle,
    headerEditor:        headerEditorStyle,
    compactedBox:        compactedBoxStyle,
    extendedBox:         extendedBoxStyle,
    editor:              editorStyle,
    glyphs:              glyphsStyle,
  };
}

/******************************************************************************/
