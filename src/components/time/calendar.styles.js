import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, _props) {
  const boxStyle = {
    display:       'flex',
    flexDirection: 'row',
  };

  const monthStyle = {
    display:         'flex',
    flexDirection:   'column',
    backgroundColor: theme.palette.calendarBackground,
    marginRight:     theme.shapes.lineSpacing,
  };

  const singleMonthStyle = {
    display:         'flex',
    flexDirection:   'column',
    backgroundColor: theme.palette.calendarBackground,
  };

  const headerStyle = {
    width:          Unit.multiply (theme.shapes.calendarButtonWidth, 7),
    display:        'flex',
    flexDirection:  'row',
    justifyContent: 'center',
    color:          theme.palette.calendarHeaderText,
  };

  const headerTextStyle = {
    flexGrow:      1,
    textAlign:     'center',
    lineHeight:    theme.shapes.calendarButtonSize,
    color:         theme.palette.calendarHeaderText,
    fontWeight:    'bold',
    textTransform: 'uppercase',
    alignSelf:     'center',
  };

  const dowTextStyle = {
    width:      theme.shapes.calendarButtonWidth,
    textAlign:  'center',
    lineHeight: theme.shapes.calendarButtonSize,
    color:      theme.palette.calendarHeaderText,
    fontSize:   Unit.multiply (theme.shapes.calendarDOWTextSize, theme.typo.fontScale),
  };

  const dowLineStyle = {
    display:       'flex',
    flexDirection: 'row',
    margin:        '0px 0px 2px 0px',
  };

  const lineStyle = {
    display:       'flex',
    flexDirection: 'row',
    margin:        '0px',
  };

  const columnStyle = {
    display:       'flex',
    flexDirection: 'column',
  };

  return {
    box:         boxStyle,
    month:       monthStyle,
    singleMonth: singleMonthStyle,
    header:      headerStyle,
    headerText:  headerTextStyle,
    dowText:     dowTextStyle,
    dowLine:     dowLineStyle,
    line:        lineStyle,
    column:      columnStyle,
  };
}

/******************************************************************************/
