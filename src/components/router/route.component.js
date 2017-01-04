'use strict';

import React from 'react';
import {Button, ButtonClose} from '../../all-components.js';

/******************************************************************************/

export default class Route extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const {state} = this.props;
    const closable = this.read ('closable');

    if (closable === 'true') {
      return (
        <ButtonClose {...this.props} {...this.link ()} />
      );
    } else {
      return (
        <Button {...this.props} {...this.link ()} />
      );
    }
  }
}

/******************************************************************************/
