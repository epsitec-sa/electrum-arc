'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

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
    overflowY:       'hidden',
  };

  const eventsStyle = {
    position:        'relative',
    display:         'flex',
    flexDirection:   'column',
    flexGrow:        1,
    overflowX:       'auto',
    overflowY:       'hidden',
  };

  const labelTopStyle = {
    position:        'relative',
    minHeight:       theme.shapes.chronosTopHeight,
    maxHeight:       theme.shapes.chronosTopHeight,
    padding:         '0px 0px 0px 10px',
    display:         'flex',
    flexDirection:   'row',
    justifyContent:  'center',
    backgroundColor: theme.palette.chronoDayBackground,
    fontWeight:      'bold',
    textTransform:   'uppercase',
    userSelect:      'none',
    cursor:          'default',
  };

  const eventTopStyle = {
    position:        'relative',
    minHeight:       theme.shapes.chronosTopHeight,
    maxHeight:       theme.shapes.chronosTopHeight,
    display:         'flex',
    flexDirection:   'row',
    justifyContent:  'center',
    userSelect:      'none',
    cursor:          'default',
  };

  const separatorStyle = {
    minHeight:       theme.shapes.chronosLineHeight,
    maxHeight:       theme.shapes.chronosLineHeight,
  };

  return {
    box:        boxStyle,
    header:     headerStyle,
    headerText: headerTextStyle,
    content:    contentStyle,
    labels:     labelsStyle,
    events:     eventsStyle,
    labelTop:   labelTopStyle,
    eventTop:   eventTopStyle,
    separator:  separatorStyle,
  };
}

/******************************************************************************/
