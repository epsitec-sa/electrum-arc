'use strict';

/******************************************************************************/

export default function styles (theme, props) {
  const tableStyle = {
    display:         'flex',
    flexDirection:   'column',
    backgroundColor: theme.palette.tableBackground,
    cursor:          'default',
  };

  const headerStyle = {
    display:         'flex',
    flexDirection:   'row',
    cursor:          'default',
  };

  const rowStyle = {
    display:         'flex',
    flexDirection:   'row',
    cursor:          'default',
  };

  const titleStyle = {
    margin:          '0px 1px 1px 0px',
    padding:         theme.shapes.tablePadding,
    fontWeight:      'bold',
    textTransform:   'uppercase',
    backgroundColor: theme.palette.tableHeaderBackground,
    cursor:          'default',
  };

  const cellStyle = {
    margin:          '0px 1px 1px 0px',
    padding:         theme.shapes.tablePadding,
    backgroundColor: theme.palette.tableCellBackground,
    cursor:          'default',
  };

  return {
    table:  tableStyle,
    header: headerStyle,
    row:    rowStyle,
    title:  titleStyle,
    cell:   cellStyle,
  };
}

/******************************************************************************/
