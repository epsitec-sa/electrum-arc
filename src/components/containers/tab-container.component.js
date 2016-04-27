'use strict';

import React from 'react';
import {Action} from 'electrum';
/******************************************************************************/

export default class TabContainer extends React.Component {

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
      border:          '1px solid #888',
      padding:         '0px 20px 0px 20px',
      margin:          '0px -20px 20px -20px',
      borderStyle:     'none none solid none',
      borderColor:     '#ccc',
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
