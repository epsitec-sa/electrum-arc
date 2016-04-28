'use strict';

import React from 'react';
import {Action} from 'electrum';
/******************************************************************************/

export default class FooterContainer extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);

    var containerStyle = {
      display:         'flex',
      flexDirection:   'row',
      justifyContent:  'space-between',
      alignItems:      'center',
      padding:         '20px 20px 20px 20px',
      margin:          '0px -20px -10px -20px',
      borderStyle:     'none',
      backgroundColor: '#fff',
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
