'use strict';

import React from 'react';
import {Action} from 'electrum';
/******************************************************************************/

export default class LeftContainer extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);

    var containerStyle = {
      zIndex:          '2',
      width:           '80px',
      display:         'flex',
      flexDirection:   'column',
      justifyContent:  'flex-start',
      alignItems:      'flex-start',
      padding:         '0px',
      margin:          '0px',
      borderStyle:     'none',
      backgroundColor: '#336799',
      boxShadow:       '0px 0px 60px rgba(0, 0, 0, 0.50)',
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
