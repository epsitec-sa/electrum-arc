'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

// See http://stackoverflow.com/questions/986937/how-can-i-get-the-browsers-scrollbar-sizes
function getScrollBarWidth () {
  var inner = document.createElement ('p');
  inner.style.width = '100%';
  inner.style.height = '200px';

  var outer = document.createElement ('div');
  outer.style.position   = 'absolute';
  outer.style.top        = '0px';
  outer.style.left       = '0px';
  outer.style.visibility = 'hidden';
  outer.style.width      = '200px';
  outer.style.height     = '150px';
  outer.style.overflow   = 'hidden';
  outer.appendChild (inner);

  document.body.appendChild (outer);
  var w1 = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  var w2 = inner.offsetWidth;
  if (w1 === w2) {
    w2 = outer.clientWidth;
  }

  document.body.removeChild (outer);
  return (w1 - w2);
}

export default function styles (theme, props) {
  const boxStyle = {
    display:         'flex',
    flexDirection:   'column',
    flexGrow:        1,
    padding:         theme.shapes.eventMargin,
    overflowY:       'hidden',
    backgroundColor: theme.palette.eventBackground,
  };

  const headerStyle = {
    minHeight:       theme.shapes.lineHeight,
    margin:          '0px 0px ' + theme.shapes.eventSeparator + ' 0px',
    display:         'flex',
    flexDirection:   'row',
    justifyContent:  'center',
    color:           theme.palette.eventHeaderText,
  };

  const headerTextStyle = {
    flexGrow:        1,
    textAlign:       'center',
    color:           theme.palette.eventHeaderText,
    fontWeight:      'bold',
    textTransform:   'uppercase',
    alignSelf:       'center',
  };

  const sw = getScrollBarWidth ();
  const dowsStyle = {
    minHeight:       theme.shapes.lineHeight,
    margin:          '0px ' + sw + ' ' + theme.shapes.eventSeparator + ' 0px',
    display:         'flex',
    flexDirection:   'row',
    justifyContent:  'center',
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

  const hourStyle = {
    display:         'flex',
    flexDirection:   'column',
    flexGrow:        1,
    flexBasis:       0,
    margin:          '0px ' + theme.shapes.eventSeparator + ' ' + theme.shapes.eventSeparator + ' 0px',
    color:           theme.palette.eventHeaderText,
    backgroundColor: theme.palette.eventDowsBackground,
  };

  const rowStyle = {
    display:         'flex',
    flexDirection:   'row',
    flexGrow:        1,
    overflowY:       'scroll',
  };

  const partsStyle = {
    display:         'flex',
    flexDirection:   'column',
    flexGrow:        1,
    alignItems:      'stretch',
    overflowY:       'scroll',
  };

  const part1Style = {
    display:         'table',
    width:           '100%',
  };

  const part2Style = {
    display:         'flex',
    flexDirection:   'row',
  };

  const part3Style = {
    display:         'flex',
    flexDirection:   'row',
    backgroundColor: theme.palette.eventOddBackground,
  };

  const columnStyle = {
    display:         'flex',
    flexDirection:   'column',
    flexGrow:        1,
    flexBasis:       0,
    margin:          '0px ' + theme.shapes.eventSeparator + ' 0px 0px',
  };

  return {
    box:        boxStyle,
    header:     headerStyle,
    headerText: headerTextStyle,
    dows:       dowsStyle,
    dow:        dowStyle,
    hour:       hourStyle,
    row:        rowStyle,
    parts:      partsStyle,
    part1:      part1Style,
    part2:      part2Style,
    part3:      part3Style,
    column:     columnStyle,
  };
}

/******************************************************************************/
