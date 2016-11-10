'use strict';

import React from 'react';
import {TextField} from 'electrum-arc';

/******************************************************************************/

export default class TicketsGlue extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      width:  this.read ('width'),
      height: this.read ('height'),
      left:   this.read ('left'),
      right:  this.read ('right'),
      top:    this.read ('top'),
      bottom: this.read ('bottom'),
      rotate: this.read ('rotate'),
    };
  }

  render () {
    const inputDragController = this.read ('drag-controller');

    const boxStyle = this.mergeStyles ('box');

    return (
      <div
        style                   = {boxStyle}
        data-drag-container-for = {inputDragController ? inputDragController : 'tickets'}
        >
        <TextField {...this.link ()} />
        {this.props.children}
      </div>
    );
  }
}

/******************************************************************************/
