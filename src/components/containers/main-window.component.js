'use strict';

import React from 'react';
import {Action} from 'electrum';
/******************************************************************************/

export default class MainWindow extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);

    var rowStyle = {
      display:         'flex',
      flexDirection:   'row',
      height:          '100vh',
      boxSizing:       'border-box',
      backgroundColor: '#24415f',
      margin:          '0px',
      padding:         '0px',
    };

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
