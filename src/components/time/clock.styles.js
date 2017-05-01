/******************************************************************************/

export default function styles (theme, _props) {
  const m = theme.shapes.calendarMargin;

  const boxStyle = {
    flexDirection:   'column',
    padding:         '0px ' + m + ' ' + m + ' ' + m,
    backgroundColor: theme.palette.calendarBackground,
    // boxShadow:       theme.shapes.calendarShadow,
  };

  const headerStyle = {
    display:        'flex',
    flexDirection:  'row',
    justifyContent: 'center',
    color:          theme.palette.calendarHeaderText,
  };

  const headerTextStyle = {
    flexGrow:      1,
    textAlign:     'center',
    lineHeight:    theme.shapes.calendarButtonHeight,
    color:         theme.palette.calendarHeaderText,
    fontWeight:    'bold',
    textTransform: 'uppercase',
    alignSelf:     'center',
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
    box:        boxStyle,
    header:     headerStyle,
    headerText: headerTextStyle,
    line:       lineStyle,
    column:     columnStyle,
  };
}

/******************************************************************************/
