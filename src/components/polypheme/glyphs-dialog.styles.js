/******************************************************************************/

export default function styles (_theme, _props) {
  const mainStyle = {
    display:       'flex',
    flexDirection: 'column',
    marginBottom:  '20px',
  };

  const glyphsStyle = {
    display:       'flex',
    flexDirection: 'row',
    flexWrap:      'wrap',
    alignContent:  'flex-start',
    maxHeight:     '400px',
    marginTop:     '20px',
    overflowX:     'hidden',
    overflowY:     'auto',
  };

  const sampleStyle = {
    display:       'flex',
    flexDirection: 'row',
    height:        '100px',
    overflowX:     'auto',
    overflowY:     'hidden',
  };

  return {
    main:   mainStyle,
    glyphs: glyphsStyle,
    sample: sampleStyle,
  };
}

/******************************************************************************/
