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
    const htmlTriangle = (
      <svg width={w} height={h} style={shapeStyle}>
        <path d={svgStyle.path} fill={svgStyle.backgroundColor}/>
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
