'use strict';

import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, props) {
  const a      = props.startFrom;
  const b      = props.endFrom;
  const c      = props.startTo;
  const d      = props.endTo;

  const abWidth = Unit.sub (b, a);
  const bcWidth = Unit.sub (c, b);
  const cdWidth = Unit.sub (d, c);

  const s      = theme.shapes.eventSeparator;
  const top    = s;
  const middle = '50%';
  const height = `calc(100% - ${Unit.multiply (s, 2)})`;
  const half   = `calc(50% - ${s})`;

  const startDistinctStyle = {
    position:        'absolute',
    left:            a,
    width:           abWidth,
    top:             top,
    height:          height,
    backgroundColor: theme.palette.chronoEventStartBackground,
    userSelect:      'none',
  };

  const mainDistinctStyle = {
    position:        'absolute',
    left:            b,
    width:           bcWidth,
    top:             top,
    height:          height,
    backgroundColor: theme.palette.chronoEventMainBackground,
    userSelect:      'none',
  };

  const endDistinctStyle = {
    position:        'absolute',
    left:            c,
    width:           cdWidth,
    top:             top,
    height:          height,
    backgroundColor: theme.palette.chronoEventEndBackground,
    userSelect:      'none',
  };

  const acWidth = Unit.sub (c, a);
  const cbWidth = Unit.sub (b, c);
  const bdWidth = Unit.sub (d, b);

  const startOverlapStyle = {
    position:        'absolute',
    left:            a,
    width:           acWidth,
    top:             top,
    height:          height,
    backgroundColor: theme.palette.chronoEventStartBackground,
    userSelect:      'none',
  };

  const topOverlapStyle = {
    position:        'absolute',
    left:            c,
    width:           cbWidth,
    top:             top,
    height:          half,
    backgroundColor: theme.palette.chronoEventStartBackground,
    userSelect:      'none',
  };

  const bottomOverlapStyle = {
    position:        'absolute',
    left:            c,
    width:           cbWidth,
    top:             middle,
    height:          half,
    backgroundColor: theme.palette.chronoEventEndBackground,
    userSelect:      'none',
  };

  const endOverlapStyle = {
    position:        'absolute',
    left:            b,
    width:           bdWidth,
    top:             top,
    height:          height,
    backgroundColor: theme.palette.chronoEventEndBackground,
    userSelect:      'none',
  };

  const leftTooltipStyle = {
    position:        'absolute',
    display:         'flex',
    flexDirection:   'row',
    justifyContent:  'flex-end',
    right:           '100%',
    width:           '1000px',
    height:          '100%',
    margin:          '0px 10px 0px 0px',
    userSelect:      'none',
  };

  const rightTooltipStyle = {
    position:        'absolute',
    display:         'flex',
    flexDirection:   'row',
    left:            '100%',
    width:           '1000px',
    height:          '100%',
    margin:          '0px 0px 0px 10px',
    userSelect:      'none',
  };

  const r = '8px';

  const dotStyle = {
    position:        'absolute',
    left:            `calc(${a} - ${r})`,
    width:           Unit.multiply (r, 2),
    top:             `calc(50% - ${r})`,
    height:          Unit.multiply (r, 2),
    borderRadius:    r,
    backgroundColor: theme.palette.chronoEventMainBackground,
  };

  const fromDotStyle = {
    position:        'absolute',
    left:            `calc(${a} - ${r})`,
    width:           Unit.multiply (r, 2),
    top:             `calc(50% - ${r})`,
    height:          Unit.multiply (r, 2),
    borderRadius:    r,
    backgroundColor: theme.palette.chronoEventStartBackground,
  };

  const toDotStyle = {
    position:        'absolute',
    left:            `calc(${c} - ${r})`,
    width:           Unit.multiply (r, 2),
    top:             `calc(50% - ${r})`,
    height:          Unit.multiply (r, 2),
    borderRadius:    r,
    backgroundColor: theme.palette.chronoEventEndBackground,
  };

  return {
    startDistinct: startDistinctStyle,
    mainDistinct:  mainDistinctStyle,
    endDistinct:   endDistinctStyle,
    startOverlap:  startOverlapStyle,
    topOverlap:    topOverlapStyle,
    bottomOverlap: bottomOverlapStyle,
    endOverlap:    endOverlapStyle,
    leftTooltip:   leftTooltipStyle,
    rightTooltip:  rightTooltipStyle,
    dot:           dotStyle,
    fromDot:       fromDotStyle,
    toDot:         toDotStyle,
  };
}

/******************************************************************************/
