'use strict';

/******************************************************************************/

export default function styles (theme, props) {
  const rowStyle = {
    position:        'relative',
    display:         'flex',
    flexDirection:   'row',
    cursor:          'default',
  };

  const cellStyle = {
    margin:          '0px 1px 1px 0px',
    padding:         theme.shapes.tablePadding,
    backgroundColor: theme.palette.tableCellBackground,
    cursor:          'default',
  };

  const hoverStyle = {
    margin:          '0px 1px 1px 0px',
    padding:         theme.shapes.tablePadding,
    backgroundColor: theme.palette.tableHoverBackground,
    cursor:          'default',
  };

  const selectedStyle = {
    margin:          '0px 1px 1px 0px',
    padding:         theme.shapes.tablePadding,
    backgroundColor: theme.palette.tableSelectedBackground,
    color:           theme.palette.tableSelectedText,
    cursor:          'default',
  };

  return {
    row:      rowStyle,
    cell:     cellStyle,
    hover:    hoverStyle,
    selected: selectedStyle,
  };
}

/******************************************************************************/
