'use strict';

import React from 'react';
import StateManager from './state-manager.js';

/******************************************************************************/

export default class Roadbook extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      gen: 0,
    };
  }

  getGen () {
    return this.state.gen;
  }

  setGen (value) {
    this.setState ( {
      gen: value
    });
  }

  componentDidMount () {
    if (!window.document.roadbooks) {
      window.document.roadbooks = [];
    }
    window.document.roadbooks.push (this);
  }

  componentWillUnmount () {
    const index = window.document.roadbooks.indexOf (this);
    if (index !== -1) {
      window.document.roadbooks.splice (index, 1);
    }
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

    const extendedBoxStyle  = this.mergeStyles ('extendedBox');
    const compactedBoxStyle = this.mergeStyles ('compactedBox');

    const compacted = StateManager.isMessengerCompacted (roadbook.id);

    // When dragging, show a source component empty.
    const children = (hasHeLeft && !isDragged) ? null : this.props.children;

    return (
      <div style = {compacted ? compactedBoxStyle : extendedBoxStyle}>
        {roadbook.gen} toto {this.getGen ()}
        {children}
      </div>
    );
  }
}

/******************************************************************************/
