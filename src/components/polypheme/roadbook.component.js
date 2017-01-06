'use strict';

import React from 'react';
import {isExtended} from './ticket-helpers.js';

/******************************************************************************/

export default class Roadbook extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      hasHeLeft: this.read ('hasHeLeft'),
      isDragged: this.read ('isDragged'),
    };
  }

  render () {
    const data      = this.read ('data');
    const roadbook  = this.read ('roadbook');
    const hasHeLeft = this.read ('hasHeLeft');
    const isDragged = this.read ('isDragged');

    const extended = isExtended (data, roadbook.id);

    const boxStyle = this.mergeStyles ('box');

    if (extended) {
      boxStyle.backgroundColor = '#f00';
    }

    // When dragging, show a source component empty.
    const children = (hasHeLeft && !isDragged) ? null : this.props.children;

    return (
      <div style = {boxStyle}>
        {children}
      </div>
    );
  }
}

/******************************************************************************/
