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
      width:  this.read ('width'),
      height: this.read ('height'),
      kind:   this.read ('kind'),
    };
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);

    const boxStyle     = this.mergeStyles ('box');
    const shapeStyle   = this.mergeStyles ('shape');
    const svgStyle     = this.mergeStyles ('svg');
    const contentStyle = this.mergeStyles ('content');

    const w  = boxStyle.width;
    const h  = boxStyle.height;
    // const d  = theme.shapes.mainTabTriangleSize;
    // const x2 = Unit.multiply (w, 0.5);
    // const x1 = Unit.sub (x2, d);
    // const y2 = Unit.sub (h,  d);
    // const x3 = Unit.add (x2, d);
    // const p  = (x1 + h + x2 + y2 + x3 + h).replace (/px/g, ' ');
    // const p = '0 0 300 0 100 0';
    const htmlTriangle = (
      <svg width={w} height={h} style={shapeStyle}>
        <polygon points="0 0 300 0 0 100" fill={svgStyle.backgroundColor}/>
      </svg>
    );

    return (
      <div
        disabled={disabled}
        style={boxStyle}
        >
        {htmlTriangle}
        <div style={contentStyle} {...this.props} />
      </div>
    );
  }
}

/******************************************************************************/
