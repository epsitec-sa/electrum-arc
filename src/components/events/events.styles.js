'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const boxStyle = {
    flexDirection:   'column',
    padding:         theme.shapes.eventMargin,
    backgroundColor: theme.palette.eventBackground,
  };

  const headerStyle = {
    display:         'flex',
    flexDirection:   'row',
    justifyContent:  'center',
    color:           theme.palette.eventHeaderText,
  };

  const headerTextStyle = {
    flexGrow:        1,
    textAlign:       'center',
    lineHeight:      theme.shapes.eventButtonHeight,
    color:           theme.palette.eventHeaderText,
    fontWeight:      'bold',
    textTransform:   'uppercase',
    alignSelf:       'center',
  };

  const rowStyle = {
    display:         'flex',
    flexDirection:   'row',
  };

  const columnStyle = {
    display:         'flex',
    flexDirection:   'column',
    flexGrow:        1,
    flexBasis:       0,
    margin:          '0px ' + theme.shapes.eventSeparator + ' 0px 0px',
  };

  const dowTextStyle = {
    textAlign:       'center',
    lineHeight:      theme.shapes.eventButtonHeight,
    margin:          theme.shapes.eventSeparator + ' 0px 0px 0px',
    color:           theme.palette.eventHeaderText,
    backgroundColor: theme.palette.eventColumnBackground,
  };

  const eventBoxStyle = {
    display:         'flex',
    flexDirection:   'row',
    margin:          theme.shapes.eventSeparator + ' 0px 0px 0px',
    backgroundColor: theme.palette.eventColumnBackground,
  };

  const eventContentStyle = {
    display:         'flex',
    flexDirection:   'row',
    padding:         theme.shapes.eventPadding,
  };

  return {
    box:          boxStyle,
    header:       headerStyle,
    headerText:   headerTextStyle,
    row:          rowStyle,
    column:       columnStyle,
    dowText:      dowTextStyle,
    eventBox:     eventBoxStyle,
    eventContent: eventContentStyle,
  };
}

/******************************************************************************/
