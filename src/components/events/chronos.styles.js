'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const mainStyle = {
    display:         'flex',
    flexDirection:   'row',
    flexGrow:        1,
    overflowX:       'hidden',
    overflowY:       'hidden',
    backgroundColor: theme.palette.chronoNavigatorBackground,
  };

  const navigationStyle = {
    display:         'flex',
    flexDirection:   'column',
    margin:          theme.shapes.chronosNavigatorMargin,
    overflowX:       'hidden',
    overflowY:       'auto',
  };

  const contentStyle = {
    display:         'flex',
    flexDirection:   'column',
    flexGrow:        1,
    overflowX:       'hidden',
    overflowY:       'auto',
    backgroundColor: theme.palette.eventBackground,
  };

  const topStyle = {
    minHeight:       theme.shapes.chronosTopHeight,
    maxHeight:       theme.shapes.chronosTopHeight,
    width:           '100%',
    display:         'flex',
    flexDirection:   'row',
    backgroundColor: theme.palette.chronoDayBackground,
    userSelect:      'none',
    cursor:          'default',
  };

  const topLabelStyle = {
    minHeight:       theme.shapes.chronosTopHeight,
    maxHeight:       theme.shapes.chronosTopHeight,
    width:           theme.shapes.chronosLabelWidth,
    borderRight:     theme.shapes.chronosSeparatorWidth + ' solid ' + theme.palette.chronoNavigatorBackground,
    display:         'flex',
    flexDirection:   'row',
    fontWeight:      'bold',
    textTransform:   'uppercase',
    userSelect:      'none',
    cursor:          'default',
  };

  const topEventStyle = {
    position:        'relative',
    minHeight:       theme.shapes.chronosTopHeight,
    maxHeight:       theme.shapes.chronosTopHeight,
    flexGrow:        1,
    display:         'flex',
    flexDirection:   'row',
    justifyContent:  'center',
    userSelect:      'none',
    cursor:          'default',
  };

  const lineStyle = {
    minHeight:       theme.shapes.chronosLineHeight,
    maxHeight:       theme.shapes.chronosLineHeight,
    width:           '100%',
    display:         'flex',
    flexDirection:   'row',
    userSelect:      'none',
    cursor:          'default',
  };

  const lineLabelStyle = {
    minHeight:       theme.shapes.chronosLineHeight,
    maxHeight:       theme.shapes.chronosLineHeight,
    width:           theme.shapes.chronosLabelWidth,
    borderRight:     theme.shapes.chronosSeparatorWidth + ' solid ' + theme.palette.chronoNavigatorBackground,
    display:         'flex',
    flexDirection:   'row',
    userSelect:      'none',
    cursor:          'default',
  };

  const lineEventStyle = {
    position:        'relative',
    minHeight:       theme.shapes.chronosLineHeight,
    maxHeight:       theme.shapes.chronosLineHeight,
    flexGrow:        1,
    display:         'flex',
    flexDirection:   'row',
    justifyContent:  'center',
    userSelect:      'none',
    cursor:          'default',
  };

  const sepStyle = {
    minHeight:       theme.shapes.chronosSeparatorHeight,
    maxHeight:       theme.shapes.chronosSeparatorHeight,
    width:           '100%',
    display:         'flex',
    flexDirection:   'row',
    userSelect:      'none',
    cursor:          'default',
  };

  return {
    main:       mainStyle,
    navigation: navigationStyle,
    content:    contentStyle,
    top:        topStyle,
    topLabel:   topLabelStyle,
    topEvent:   topEventStyle,
    line:       lineStyle,
    lineLabel:  lineLabelStyle,
    lineEvent:  lineEventStyle,
    sep:        sepStyle,
  };
}

/******************************************************************************/
