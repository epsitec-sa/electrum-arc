'use strict';

import React from 'react';
import {Action} from 'electrum';
import * as Theme from '../theme-base.js';
import * as Unit from '../unit-helpers.js';
/******************************************************************************/

export default class BasicRow extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state, spacing} = this.props;
    const disabled = Action.isDisabled (state);
    const inputSpacing = spacing || state.get ('spacing');

    const s = Theme.geometry.lineSpacing;

    var rowStyle = {
      display:         'flex',
      flexDirection:   'row',
      justifyContent:  'space-between',
      alignItems:      'center',
      margin:          '0px 0px ' + s + ' 0px',
    };

    if (inputSpacing === 'compact') {
      rowStyle.margin = '0px 0px 0px 0px';
    }

    return (
      <div
        disabled={disabled}
        style={rowStyle}
        {...this.props}
        />
    );
  }
}

/******************************************************************************/
