/******************************************************************************/

export default function styles (theme, props) {
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
    maxHeight:     '500px',
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
    marginBottom:  '20px',
  };

  return {
    main:   mainStyle,
    glyphs: glyphsStyle,
    sample: sampleStyle,
  };
}

/******************************************************************************/
