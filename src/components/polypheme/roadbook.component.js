'use strict';

import React from 'react';

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
    const hasHeLeft = this.read ('hasHeLeft');
    const isDragged = this.read ('isDragged');

    const boxStyle = this.mergeStyles ('box');

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
