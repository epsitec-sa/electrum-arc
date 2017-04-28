import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, _props) {
  const s = theme.shapes.lineSpacing;
  const n = Unit.multiply (theme.shapes.lineSpacing, -1);

  const boxStyle = {
    height:          '34px',
    overflowY:       'hidden',
    margin:          '0px 0px ' + s + ' 0px',
    backgroundColor: theme.palette.recurrenceExtendedBackground,
    transition:      theme.transitions.easeOut (400, 'height'),
    // transitionProperty: 'height',
    // transitionDuration: '1s',
  };

  const extendedBoxStyle = {
    height:          '340px',
    overflowY:       'hidden',
    margin:          '0px 0px ' + s + ' 0px',
    // padding:         s,
    backgroundColor: theme.palette.recurrenceExtendedBackground,
    transition:      theme.transitions.easeOut (400, 'height'),
    // transitionProperty: 'height',
    // transitionDuration: '1s',
  };

  const singleStyle = {
    display:         'flex',
    flexDirection:   'row',
    backgroundColor: theme.palette.calendarWeekendBackground,
    color:           theme.palette.calendarHeaderText,
    transition:      theme.transitions.easeOut (400, 'background-color'),
  };

  const headerStyle = {
    display:         'flex',
    flexDirection:   'row',
    // margin:          n + ' ' + n + ' ' + s + ' ' + n,
    backgroundColor: theme.palette.calendarActiveBackground,
    color:           theme.palette.calendarActiveText,
    transition:      theme.transitions.easeOut (400, 'background-color'),
  };

  const editStyle = {
    display:       'flex',
    flexDirection: 'row',
    // marginTop:     s,
    margin:        s + ' ' + s + ' 0px ' + s,
  };

  const createStyle = {
    display:         'flex',
    flexDirection:   'row',
    // marginTop:     s,
    backgroundColor: theme.palette.calendarBackground,
  };

  return {
    box:         boxStyle,
    extendedBox: extendedBoxStyle,
    header:      headerStyle,
    single:      singleStyle,
    edit:        editStyle,
    create:      createStyle,
  };
}

/******************************************************************************/
