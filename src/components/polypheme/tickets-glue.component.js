'use strict';

import React from 'react';
import {Label, TextField} from 'electrum-arc';

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
    const inputTitle          = this.read ('title');
    const inputMode           = this.read ('mode');

    const boxStyle       = this.mergeStyles ('box');
    const containerStyle = this.mergeStyles ('container');

    let htmlEdit;
    if (inputMode === 'edit') {
      htmlEdit = (
        <TextField value={inputTitle} {...this.link ()} />
      );
    } else {
      htmlEdit = (
        <Label kind='tickets-glue' text={inputTitle} {...this.link ()} />
      );
    }

    return (
      <div
        style = {boxStyle}
        >
        {htmlEdit}
        <div
          style                   = {containerStyle}
          data-drag-container-for = {inputDragController ? inputDragController : 'tickets'}
          >
          {this.props.children}
        </div>
      </div>
    );
  }
}

/******************************************************************************/
