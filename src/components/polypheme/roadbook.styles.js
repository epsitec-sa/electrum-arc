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

  const boxStyle = {
    padding:         '0px ' + mm + ' 0px ' + mm,
    display:         'flex',
    flexDirection:   'column',
    flexGrow:        0,
    margin:          '0px ' + theme.shapes.viewSpacing + ' 0px 0px',
    backgroundColor: bc,
    minWidth:        mw,
  };

  return {
    box: boxStyle,
  };
}

/******************************************************************************/
