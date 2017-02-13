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

  const labelsStyle = {
    display:         'flex',
    flexDirection:   'column',
    flexGrow:        1,
    overflowX:       'hidden',
  };

  const eventsStyle = {
    display:         'flex',
    flexDirection:   'column',
    flexGrow:        1,
    overflowX:       'scroll',
  };

  const topStyle = {
    position:        'relative',
    height:          '30px',
    margin:          '0px 0px ' + theme.shapes.eventSeparator + ' 0px',
    display:         'flex',
    flexDirection:   'row',
    justifyContent:  'center',
    backgroundColor: theme.palette.chronoDayBackground,
  };

  const lineStyle = {
    position:        'relative',
    height:          '20px',
    margin:          '0px 0px ' + theme.shapes.eventSeparator + ' 0px',
    display:         'flex',
    flexDirection:   'row',
    justifyContent:  'flex-start',
  };

  return {
    box:        boxStyle,
    header:     headerStyle,
    headerText: headerTextStyle,
    content:    contentStyle,
    labels:     labelsStyle,
    events:     eventsStyle,
    top:        topStyle,
    line:       lineStyle,
  };
}

/******************************************************************************/
