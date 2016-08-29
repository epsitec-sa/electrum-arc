'use strict';

/******************************************************************************/

export default function styles (theme, props) {
  const inputWidth  = props.width;
  const inputHeight = props.height;
  const inputKind   = props.kind;

  let width           = inputWidth;
  let height          = inputHeight;
  let backgroundColor = null;

  const h = theme.shapes.lineHeight;
  const m = theme.shapes.containerMargin;
  const s = theme.shapes.lineSpacing;

  if (inputKind === 'header') {
    backgroundColor = theme.palette.ticketHeaderBackground;
  } else {
    backgroundColor = theme.palette.ticketBackground;
  }

  const boxStyle = {
    width:           width,
    height:          height,
    margin:          '0px 0px ' + s + ' 0px',
    position:        'relative',
  };

  const shapeStyle = {
    position:        'absolute',
  };

  const svgStyle = {
    backgroundColor: backgroundColor,
  };

  const contentStyle = {
    position:        'relative',
    padding:         s,
  };

  return {
    box:     boxStyle,
    shape:   shapeStyle,
    svg:     svgStyle,
    content: contentStyle,
  };
}

/******************************************************************************/
