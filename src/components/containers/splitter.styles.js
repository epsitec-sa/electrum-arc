'use strict';

/******************************************************************************/

export default function styles (theme, props) {
  const inputKind   = props.kind;
  const inputWidth  = props.width;
  const inputHeight = props.height;

  let width  = inputWidth;
  let height = inputHeight;
  let cursor = null;

  if (inputKind === 'vertical') {
    if (!width) {
      width = theme.shapes.splitterSize;
    }
    cursor = 'col-resize';
  } else {
    if (!height) {
      height = theme.shapes.splitterSize;
    }
    cursor = 'row-resize';
  }

  let resizerStyle = {
    zIndex:     1,
    width:      width,
    minWidth:   width,
    height:     height,
    minHeight:  height,
    cursor:     cursor,
    background: theme.palette.splitterBackground,
  };

  resizerStyle[':hover'] = {
    background: theme.palette.splitterBackgroundHover,  // TODO: does not work !!!
  };

  return {
    resizerStyle: resizerStyle,
  };
}

/******************************************************************************/
