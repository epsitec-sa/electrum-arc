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
    overflowX:       'hidden',
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

  const contentStyle = {
    display:         'flex',
    flexDirection:   'row',
    flexGrow:        1,
    overflowX:       'hidden',
  };

  const sw = getScrollBarWidth ();
  const dowsStyle = {
    minWidth:        '100px',
    margin:          '0px ' + theme.shapes.eventSeparator + ' ' + sw + ' 0px',
    display:         'flex',
    flexDirection:   'column',
    justifyContent:  'center',
  };

  const topDowStyle = {
    width:           '100px',
    height:          '30px',
    display:         'flex',
    flexDirection:   'column',
    margin:          '0px 0px ' + theme.shapes.eventSeparator + ' 0px',
    color:           theme.palette.eventHeaderText,
    backgroundColor: theme.palette.eventDowsBackground,
  };

  const dowStyle = {
    display:         'flex',
    flexDirection:   'column',
    flexGrow:        1,
    flexBasis:       0,
    margin:          '0px 0px ' + theme.shapes.eventSeparator + ' 0px',
    color:           theme.palette.eventHeaderText,
    backgroundColor: theme.palette.eventDowsBackground,
  };

  const columnStyle = {
    display:         'flex',
    flexDirection:   'column',
    flexGrow:        1,
    overflowX:       'scroll',
  };

  const topRowStyle = {
    position:        'relative',
    height:          '30px',
    margin:          '0px 0px ' + theme.shapes.eventSeparator + ' 0px',
  };

  const rowStyle = {
    position:        'relative',
    display:         'flex',
    flexDirection:   'row',
    flexGrow:        1,
    flexBasis:       0,
    margin:          '0px 0px ' + theme.shapes.eventSeparator + ' 0px',
  };

  return {
    box:        boxStyle,
    header:     headerStyle,
    headerText: headerTextStyle,
    content:    contentStyle,
    dows:       dowsStyle,
    topDow:     topDowStyle,
    dow:        dowStyle,
    column:     columnStyle,
    row:        rowStyle,
    topRow:     topRowStyle,
  };
}

/******************************************************************************/
