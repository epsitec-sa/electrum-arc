import {Unit} from 'electrum-theme';

/******************************************************************************/

export default function styles (theme, _props) {
  const s = theme.shapes.lineSpacing;
  const n = Unit.multiply (theme.shapes.lineSpacing, -1);

  const boxStyle = {
    margin: '0px 0px ' + s + ' 0px',
  };

  const extendedBoxStyle = {
    margin:          '0px 0px ' + s + ' 0px',
    padding:         s,
    backgroundColor: theme.palette.recurrenceExtendedBackground,
  };

  const singleStyle = {
    display:       'flex',
    flexDirection: 'row',
  };

  const headerStyle = {
    display:         'flex',
    flexDirection:   'row',
    margin:          n + ' ' + n + ' ' + s + ' ' + n,
    backgroundColor: theme.palette.calendarActiveBackground,
  };

  const editStyle = {
    display:       'flex',
    flexDirection: 'row',
    marginTop:     s,
  };

  return {
    box:         boxStyle,
    extendedBox: extendedBoxStyle,
    header:      headerStyle,
    single:      singleStyle,
    edit:        editStyle,
  };
}

/******************************************************************************/
