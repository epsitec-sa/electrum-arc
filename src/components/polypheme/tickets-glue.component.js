'use strict';

import React from 'react';

import {TextField} from '../../all-components.js';
import {ColorHelpers} from 'electrum-theme';

/******************************************************************************/

export default class TicketsGlue extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    const width  = '220px';
    const height = '164px';  // '82px' * 2
    const inputLeft           = this.read ('left');
    const inputRight          = this.read ('right');
    const inputTop            = this.read ('top');
    const inputBottom         = this.read ('bottom');
    const inputRotate         = this.read ('rotate');
    const inputDragController = this.read ('drag-controller');

    const boxStyle = {
      position:        'absolute',
      left:            inputLeft,
      right:           inputRight,
      top:             inputTop,
      bottom:          inputBottom,
      transform:       'rotate(' + inputRotate + ')',
      minWidth:        width,
      minHeight:       height,
      backgroundColor: this.props.theme.palette.ticketGlueBackground,
      boxShadow:       this.props.theme.shapes.ticketGlueShadow,
    };

    return (
      <div
        style                   = {boxStyle}
        data-drag-container-for = {inputDragController}
        >
        <TextField {...this.link ()} />
        {this.props.children}
      </div>
    );
  }
}

/******************************************************************************/
