'use strict';

import React from 'react';
import {Action} from 'electrum';
import {Unit} from 'electrum-theme';

/******************************************************************************/

export default class Badge extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state, theme, value} = this.props;
    const disabled = Action.isDisabled (state);
    const inputValue = value || state.get ('value');

    var truncatedValue = inputValue.toString ();
    if (truncatedValue.length > 3) {
      truncatedValue = truncatedValue.substring (0, 3) + '...';
    }

    var boxStyle = {
      width:           theme.shapes.lineHeight,
      height:          theme.shapes.lineHeight,
      display:         'flex',
      flexDirection:   'row',
      justifyContent:  'center',
      alignItems:      'center',
    };

    const h = Unit.multiply (theme.shapes.badgeRadius, 2.0);
    const m = Unit.multiply (theme.shapes.badgeRadius, 0.5);
    const w = Unit.sub (h, Unit.multiply (m, 2.0));

    var labelStyle = {
      minWidth:        w,
      height:          h,
      borderRadius:    theme.shapes.badgeRadius,
      padding:         '0px ' + m + ' 1px ' + m,
      display:         'flex',
      flexDirection:   'row',
      justifyContent:  'center',
      alignItems:      'center',
      fontSize:        Unit.multiply (theme.shapes.badgeTextSize, theme.typo.fontScale),
      fontWeight:      'bold',
      color:           theme.palette.badgeText,
      backgroundColor: theme.palette.badgeBackground,
    };

    return (
      <div
        disabled={disabled}
        style={boxStyle}
        {...this.props}
        >
        <label
          style={labelStyle}
          {...this.props}
          >
          {truncatedValue}
        </label>
      </div>
    );
  }
}

/******************************************************************************/
