'use strict';

import React from 'react';
import {Action} from 'electrum';

/******************************************************************************/

export default class Ticket extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      width:    this.read ('width'),
      height:   this.read ('height'),
      kind:     this.read ('kind'),
      selected: this.read ('selected'),
      color:    this.read ('color'),
    };
  }

  render () {
    const {state}       = this.props;
    const disabled      = Action.isDisabled (state);
    const dragHandle    = this.read ('drag-handle');
    const notDraggable  = this.read ('no-drag');

    const boxStyle      = this.mergeStyles ('box');
    const shadowStyle   = this.mergeStyles ('shadow');
    const shapeStyle    = this.mergeStyles ('shape');
    const svgStyle      = this.mergeStyles ('svg');
    const contentStyle  = this.mergeStyles ('content');
    const dragZoneStyle = this.mergeStyles ('dragZoneStyle');

    const w = boxStyle.width;
    const h = boxStyle.height;
    if (!w || !h) {
      throw new Error (`Undefined ticket width or height`);
    }
    const htmlShadow = (
      <svg width={w} height={h} style={shadowStyle}>
        <path d={svgStyle.path} fill={svgStyle.shadowColor}/>
      </svg>
    );
    const htmlShape = (
      <svg width={w} height={h} style={shapeStyle}>
        <path d={svgStyle.path} fill={svgStyle.backgroundColor}/>
      </svg>
    );

    return (
      <div
        disabled={disabled}
        style={boxStyle}
        >
        {htmlShadow}
        {htmlShape}
        <div data-drag-handle={dragHandle} style={dragZoneStyle} data-drag-invalid={notDraggable === 'true'} />
        <div style={contentStyle}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

/******************************************************************************/
