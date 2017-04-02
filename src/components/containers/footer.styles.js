/******************************************************************************/

export default function styles (theme, _props) {
  const boxStyle = {
    minHeight:       theme.shapes.footerHeight,
    display:         'flex',
    flexDirection:   'row',
    flexGrow:        0,
    justifyContent:  'flex-start',
    alignItems:      'center',
    backgroundColor: theme.palette.footerBackground,
  };

  return {
    box: boxStyle,
  };
}

/******************************************************************************/
