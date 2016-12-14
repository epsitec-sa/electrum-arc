'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const hasHeLeft = props.hasHeLeft;
  const isDragged = props.isDragged;
  const x = (hasHeLeft && !isDragged);

  const m = theme.shapes.containerMargin;
  const mm = Unit.multiply (m, 0.5);

  const bc = x ? theme.palette.roadbookDragAndDropBackground : theme.palette.roadbookBackground;
  const mw = x ? theme.shapes.tripTicketWidth : null;
  const margin = isDragged ? '0px' : '0px ' + theme.shapes.viewSpacing + ' 0px 0px';
  const border = isDragged ? theme.shapes.viewSpacing + ' solid ' + theme.palette.rootBackground : 'none';

  const boxStyle = {
    padding:         '0px ' + mm + ' 0px ' + mm,
    display:         'flex',
    flexDirection:   'column',
    flexGrow:        1,
    margin:          margin,
    backgroundColor: bc,
    border:          border,
    minWidth:        mw,
  };

  return {
    box: boxStyle,
  };
}

/******************************************************************************/
