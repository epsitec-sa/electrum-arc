'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const mainStyle = {
    display:         'flex',
    flexDirection:   'row',
    flexGrow:        1,
    overflowX:       'hidden',
    backgroundColor: theme.palette.chronoNavigatorBackground,
  };

  const navigationStyle = {
    display:         'flex',
    flexDirection:   'column',
    overflowX:       'hidden',
    margin:          theme.shapes.chronosNavigatorMargin,
  };

  const contentStyle = {
    display:         'flex',
    flexDirection:   'row',
    flexGrow:        1,
    overflowX:       'hidden',
    backgroundColor: theme.palette.eventBackground,
  };

  const labelsStyle = {
    position:        'relative',
    display:         'flex',
    flexDirection:   'column',
    flexGrow:        1,
    overflowX:       'hidden',
    overflowY:       'hidden',
    cursor:          'default',
  };

  const eventsStyle = {
    position:        'relative',
    display:         'flex',
    flexDirection:   'column',
    flexGrow:        1,
    overflowX:       'hidden',
    overflowY:       'hidden',
    cursor:          'default',
  };

  const labelTopStyle = {
    position:        'absolute',
    minHeight:       theme.shapes.chronosTopHeight,
    maxHeight:       theme.shapes.chronosTopHeight,
    width:           '100%',
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
    position:        'absolute',
    minHeight:       theme.shapes.chronosTopHeight,
    maxHeight:       theme.shapes.chronosTopHeight,
    display:         'flex',
    flexDirection:   'row',
    justifyContent:  'center',
    userSelect:      'none',
    cursor:          'default',
  };

  return {
    main:       mainStyle,
    navigation: navigationStyle,
    content:    contentStyle,
    labels:     labelsStyle,
    events:     eventsStyle,
    labelTop:   labelTopStyle,
    eventTop:   eventTopStyle,
  };
}

/******************************************************************************/
