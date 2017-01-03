'use strict';

import React from 'react';
import {Action} from 'electrum';

/******************************************************************************/

export default class Footer extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      managedChildren: null,
    };
    this.panelBottoms = [];
  }

  get styleProps () {
    return {
      width:  this.read ('width'),
      height: this.read ('height'),
    };
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);

    const boxStyle = this.mergeStyles ('box');

    return (
      <div style={boxStyle}>
        {this.props.children}
      </div>
    );
  }
}

/******************************************************************************/
