'use strict';

import React from 'react';
import {Action} from 'electrum';
/******************************************************************************/

export default class RightContainer extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);

    var containerStyle = {
      display:         'flex',
      flexDirection:   'column',
      flexGrow:        1,
      boxSizing:       'border-box',
      padding:         '0px',
      margin:          '0px',
      borderStyle:     'none',
      backgroundColor: '#24415f',
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
