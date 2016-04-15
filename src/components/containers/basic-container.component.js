'use strict';

import React from 'react';
import {Action} from 'electrum';
/******************************************************************************/

export default class BasicContainer extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state, width} = this.props;
    const disabled = Action.isDisabled (state);
    const inputWidth = width || state.get ('width');

    var containerStyle = {
      display:         'flex',
      flexDirection:   'column',
      justifyContent:  'flex-start',
      alignItems:      'stretch',
      width:           inputWidth,
      padding:         '15px 20px 15px 20px',
    };

    return (
      <div
        disabled={disabled}
        id={this.props.id}
        style={containerStyle}
        {...this.props}
        />
    );
  }
}

/******************************************************************************/
