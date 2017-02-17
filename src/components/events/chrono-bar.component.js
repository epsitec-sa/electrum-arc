'use strict';

import React from 'react';
import Converters from '../polypheme/converters';
import {Label} from '../../all-components.js';

/******************************************************************************/

export default class ChronoBar extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      startFrom: this.read ('startFrom'),
      endFrom:   this.read ('endFrom'),
      startTo:   this.read ('startTo'),
      endTo:     this.read ('endTo'),
      top:       this.read ('top'),
      height:    this.read ('height'),
    };
  }

  // If hover. draw a 'tooltip' on the right side of bar.
  renderTooltip (hover) {
    if (hover) {
      const tooltip = this.read ('tooltip');
      const style = this.mergeStyles ('tooltip');
      return (
        <div style={style}>
          <Label text={tooltip} wrap='no' {...this.link ()} />
        </div>
      );
    } else {
      return null;
    }
  }

  render () {
    console.log ('ChronoBar.render');
    const hover = this.read ('hover');

    const startStyle = this.mergeStyles ('start');
    const mainStyle  = this.mergeStyles ('main');
    const endStyle   = this.mergeStyles ('end');

    return (
      <div>
        <div style = {startStyle} {...this.link ()} />
        <div style = {mainStyle} {...this.link ()} />
        <div style = {endStyle} {...this.link ()}>
          {this.renderTooltip (hover === 'true')}
        </div>
      </div>
    );
  }
}

/******************************************************************************/
