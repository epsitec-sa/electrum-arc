'use strict';

import React from 'react';
import {Action} from 'electrum';
/******************************************************************************/

export default class MainTabContainer extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);

    var containerStyle = {
      display:         'flex',
      flexDirection:   'row',
      flexGrow:        0,
      justifyContent:  'flex-start',
      alignItems:      'center',
      padding:         '0px',
      margin:          '0px',
      borderStyle:     'none',
      backgroundColor: '#dcdcdc',
    };

    return (
      <div
        disabled={disabled}
        style={containerStyle}
        {...this.props}
        />
    );
  }
}

/******************************************************************************/
