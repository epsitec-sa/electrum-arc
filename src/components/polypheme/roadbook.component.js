'use strict';

import React from 'react';
import StateManager from './state-manager.js';

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
    const roadbook  = this.read ('roadbook');
    const hasHeLeft = this.read ('hasHeLeft');
    const isDragged = this.read ('isDragged');

    const boxStyle = this.mergeStyles ('box');

    if (StateManager.isMessengerCompacted (roadbook.id)) {
      if (boxStyle.minWidth) {
        boxStyle.minWidth = this.props.theme.shapes.tripTicketCompactedWidth;
      }
      boxStyle.padding  = '0px';
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
