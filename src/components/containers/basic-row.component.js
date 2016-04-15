'use strict';

import React from 'react';
import {Action} from 'electrum';
/******************************************************************************/

export default class BasicRow extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    var rowStyle = {
      display:         'flex',
      flexDirection:   'row',
      justifyContent:  'space-between',
      alignItems:      'center',
      margin:          '5px 0 5px 0',
    };

    return (
      <div
        id={this.props.id}
        style={rowStyle}
        {...this.props}
        />
    );
  }
}

/******************************************************************************/
