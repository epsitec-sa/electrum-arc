'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const startFrom = props.startFrom;
  const endFrom   = props.endFrom;
  const startTo   = props.startTo;
  const endTo     = props.endTo;
  const top       = props.top;
  const height    = props.height;

  console.log ('ChronoBar.style');
  const startWidth = Unit.sub (endFrom, startFrom);
  const mainWidth  = Unit.sub (startTo, endFrom);
  const endWidth   = Unit.sub (endTo, startTo);

  const startStyle = {
    position:        'absolute',
    left:            startFrom,
    width:           startWidth,
    top:             top,
    height:          height,
    backgroundColor: theme.palette.chronoEventStartBackground,
    userSelect:      'none',
  };

  const mainStyle = {
    position:        'absolute',
    left:            endFrom,
    width:           mainWidth,
    top:             top,
    height:          height,
    backgroundColor: theme.palette.chronoEventMainBackground,
    userSelect:      'none',
  };

  const endStyle = {
    position:        'absolute',
    left:            startTo,
    width:           endWidth,
    top:             top,
    height:          height,
    backgroundColor: theme.palette.chronoEventEndBackground,
    userSelect:      'none',
  };

  const tooltipStyle = {
    position:        'absolute',
    display:         'flex',
    flexDirection:   'row',
    left:            '100%',
    width:           '1000px',
    height:          '100%',
    margin:          '0px 0px 0px 10px',
    userSelect:      'none',
  };

  return {
    start:   startStyle,
    main:    mainStyle,
    end:     endStyle,
    tooltip: tooltipStyle,
  };
}

/******************************************************************************/
