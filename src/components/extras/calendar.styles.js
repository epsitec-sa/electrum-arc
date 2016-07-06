'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const boxStyle = {
    flexDirection:   'column',
    padding:         theme.shapes.calendarMargin,
    backgroundColor: theme.palette.calendarBackground,
    boxShadow:       theme.shapes.calendarShadow,
  };

  const headerStyle = {
    display:         'flex',
    flexDirection:   'row',
    justifyContent:  'center',
    color:           theme.palette.calendarHeaderText,
  };

  const headerTextStyle = {
    flexGrow:        1,
    textAlign:       'center',
    lineHeight:      theme.shapes.calendarButtonSize,
    color:           theme.palette.calendarHeaderText,
    fontWeight:      'bold',
    textTransform:   'uppercase',
    alignSelf:       'center',
  };

  const dowTextStyle = {
    flexGrow:        1,
    textAlign:       'center',
    lineHeight:      theme.shapes.calendarButtonSize,
    color:           theme.palette.calendarHeaderText,
    fontSize:        Unit.multiply (theme.shapes.calendarDOWTextSize, theme.typo.fontScale),
  };

  const dowLineStyle = {
    display:         'flex',
    flexDirection:   'row',
    margin:          '0px 0px -1px 0px',
  };

  const lineStyle = {
    display:         'flex',
    flexDirection:   'row',
    margin:          '0px 0px -1px 0px',
  };

  const columnStyle = {
    display:         'flex',
    flexDirection:   'column',
  };

  return {
    box:        boxStyle,
    header:     headerStyle,
    headerText: headerTextStyle,
    dowText:    dowTextStyle,
    dowLine:    dowLineStyle,
    line:       lineStyle,
    column:     columnStyle,
  };
}

/******************************************************************************/
