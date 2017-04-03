import * as ScrollerHelpers from './scroller-helpers.js';

/******************************************************************************/

export default function styles (theme, _props) {
  const boxStyle = {
    display:         'flex',
    flexDirection:   'column',
    flexGrow:        1,
    padding:         theme.shapes.eventMargin,
    overflowY:       'hidden',
    backgroundColor: theme.palette.eventBackground,
  };

  const headerStyle = {
    minHeight:      theme.shapes.lineHeight,
    margin:         '0px 0px ' + theme.shapes.eventSeparator + ' 0px',
    display:        'flex',
    flexDirection:  'row',
    justifyContent: 'center',
    color:          theme.palette.eventHeaderText,
  };

  const headerTextStyle = {
    flexGrow:      1,
    textAlign:     'center',
    color:         theme.palette.eventHeaderText,
    fontWeight:    'bold',
    textTransform: 'uppercase',
    alignSelf:     'center',
  };

  const sw = ScrollerHelpers.getScrollBarWidth ();
  const dowsStyle = {
    minHeight:      theme.shapes.lineHeight,
    margin:         '0px ' + sw + ' ' + theme.shapes.eventSeparator + ' 0px',
    display:        'flex',
    flexDirection:  'row',
    justifyContent: 'center',
  };

  const dowStyle = {
    display:         'flex',
    flexDirection:   'column',
    flexGrow:        1,
    flexBasis:       0,
    margin:          '0px ' + theme.shapes.eventSeparator + ' 0px 0px',
    color:           theme.palette.eventHeaderText,
    backgroundColor: theme.palette.eventDowsBackground,
  };

  const leftHeaderStyle = {
    width:           '70px',
    display:         'flex',
    flexDirection:   'column',
    margin:          '0px ' + theme.shapes.eventSeparator + ' 0px 0px',
    color:           theme.palette.eventHeaderText,
    backgroundColor: theme.palette.eventDowsBackground,
  };

  const leftStyle = {
    width:           '70px',
    display:         'flex',
    flexDirection:   'column',
    margin:          '0px ' + theme.shapes.eventSeparator + ' ' + theme.shapes.eventSeparator + ' 0px',
    color:           theme.palette.eventHeaderText,
    backgroundColor: theme.palette.eventDowsBackground,
  };

  const rowStyle = {
    display:       'flex',
    flexDirection: 'row',
    flexGrow:      1,
    overflowY:     'scroll',
  };

  const partsStyle = {
    display:       'flex',
    flexDirection: 'column',
    flexGrow:      1,
    alignItems:    'stretch',
    overflowY:     'scroll',
  };

  const partStyle = {
    display: 'table',
    width:   '100%',
  };

  const partEvenStyle = {
    display:       'flex',
    flexDirection: 'row',
  };

  const partOddStyle = {
    display:         'flex',
    flexDirection:   'row',
    backgroundColor: theme.palette.eventOddBackground,
  };

  const columnStyle = {
    display:       'flex',
    flexDirection: 'column',
    flexGrow:      1,
    flexBasis:     0,
    margin:        '0px ' + theme.shapes.eventSeparator + ' 0px 0px',
  };

  return {
    box:        boxStyle,
    header:     headerStyle,
    headerText: headerTextStyle,
    dows:       dowsStyle,
    dow:        dowStyle,
    leftHeader: leftHeaderStyle,
    left:       leftStyle,
    row:        rowStyle,
    parts:      partsStyle,
    part:       partStyle,
    partEven:   partEvenStyle,
    partOdd:    partOddStyle,
    column:     columnStyle,
  };
}

/******************************************************************************/
