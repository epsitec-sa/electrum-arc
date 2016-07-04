'use strict';

/******************************************************************************/

export default function styles (theme, props) {
  const inputWidth = props.width;

  const boxStyle = {
    width:           inputWidth,
    display:         'flex',
    flexDirection:   'row',
    justifyContent:  'center',
    alignItems:      'center',
    position:        'absolute',
    left:            '-1px',
    top:             '100%',
    margin:          '10px 0px 0px 0px',
    padding:         '10px',
    fontSize:        '80%',
    fontWeight:      'bold',
    color:           '#fff',
    backgroundColor: '#333',
    zIndex:          1,
  };

  return {
    box: boxStyle,
  };
}

/******************************************************************************/
