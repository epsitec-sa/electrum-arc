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
    const {state, theme, value, layer} = this.props;
    const disabled = Action.isDisabled (state);
    const inputValue = value || state.get ('value');
    const inputLayer = layer || state.get ('layer');

    var truncatedValue = inputValue.toString ();
    if (truncatedValue.length > 3) {
      truncatedValue = truncatedValue.substring (0, 3) + '...';
    }

    var boxPosition = null;
    var boxRight    = null;
    var boxTop      = null;

    // If badge has layer='over', place it on top-right corner of parent.
    if (inputLayer === 'over') {
      boxPosition = 'absolute';
      boxRight    = '0px';
      boxTop      = '0px';
    }

    var boxStyle = {
      width:           theme.shapes.lineHeight,
      height:          theme.shapes.lineHeight,
      display:         'flex',
      flexDirection:   'row',
      justifyContent:  'center',
      alignItems:      'center',
      position:        boxPosition,
      right:           boxRight,
      top:             boxTop,
    };

    const h = theme.shapes.badgeHeight;
    const r = theme.shapes.badgeRadius;
    const m = Unit.multiply (h, 0.25);
    const w = Unit.sub (h, Unit.multiply (m, 2.0));

    var labelStyle = {
      minWidth:        w,
      height:          h,
      borderRadius:    r,
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
