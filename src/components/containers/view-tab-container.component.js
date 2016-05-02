'use strict';

import React from 'react';
import {Action} from 'electrum';
/******************************************************************************/

export default class ViewTabContainer extends React.Component {

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
      padding:         '20px 0px 0px 0px',
      margin:          '0px',
      borderStyle:     'none',
      backgroundColor: '#222',
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
