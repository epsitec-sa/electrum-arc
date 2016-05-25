'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const boxStyle = {
    flexDirection:   'column',
    padding:         theme.shapes.calendarMargin,
    backgroundColor: theme.palette.calendarBackground,
  };

  const headerStyle = {
    display:         'flex',
    flexDirection:   'row',
    margin:          '0px 0px ' + theme.shapes.calendarMargin + ' 0px',
    justifyContent:  'center',
    color:           theme.palette.calendarHeaderText,
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
    box:    boxStyle,
    header: headerStyle,
    line:   lineStyle,
    column: columnStyle,
  };
}

/******************************************************************************/
