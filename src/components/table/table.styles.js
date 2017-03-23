'use strict';

/******************************************************************************/

export default function styles (theme, props) {
  const tableStyle = {
    display:         'flex',
    flexDirection:   'column',
    padding:         '1px 0px 0px 1px',
    backgroundColor: theme.palette.tableBackground,
    cursor:          'default',
    overflowX:       'auto',
    overflowY:       'hidden',
  };

  const headerStyle = {
    display:         'flex',
    flexDirection:   'row',
    cursor:          'default',
  };

  const cellStyle = {
    margin:          '0px 1px 1px 0px',
    padding:         theme.shapes.tablePadding,
    fontWeight:      'bold',
    textTransform:   'uppercase',
    backgroundColor: theme.palette.tableHeaderBackground,
    cursor:          'default',
  };

  return {
    table:  tableStyle,
    header: headerStyle,
    cell:   cellStyle,
  };
}

/******************************************************************************/
