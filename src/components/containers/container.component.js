'use strict';

import React from 'react';
import {Action} from 'electrum';

/******************************************************************************/

export default class Container extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      width:            this.read ('width'),
      height:           this.read ('height'),
      floatingHeight:   this.read ('floating-height'),
      kind:             this.read ('kind'),
      subkind:          this.read ('subkind'),
      markColor:        this.read ('mark-color'),
      spacing:          this.read ('spacing'),
      trianglePosition: this.read ('triangle-position'),
      grow:             this.read ('grow'),
      selected:         this.read ('selected'),
      left:             this.read ('left'),
      right:            this.read ('right'),
      top:              this.read ('top'),
      bottom:           this.read ('bottom'),
      rotate:           this.read ('rotate'),
    };
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);
    const inputKind = this.read ('kind');

    const boxStyle      = this.mergeStyles ('box');
    const triangleStyle = this.mergeStyles ('triangle');


    if (inputKind === 'flying-balloon') {
      return (
        <div
          disabled={disabled}
          style={boxStyle}
          >
          <div style={triangleStyle}>
            {this.props.children}
          </div>
        </div>
      );
    } else {
      return (
        <div disabled={disabled} style={boxStyle}>
          {this.props.children}
        </div>
      );
    }
  }
}

/******************************************************************************/
