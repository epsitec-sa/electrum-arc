'use strict';

import React from 'react';
import {Unit} from 'electrum-theme';
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

  renderDistinct () {
    const hover = this.read ('hover');

    const startStyle = this.mergeStyles ('startDistinct');
    const mainStyle  = this.mergeStyles ('mainDistinct');
    const endStyle   = this.mergeStyles ('endDistinct');

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

  renderOverlap () {
    const hover = this.read ('hover');

    const startStyle  = this.mergeStyles ('startOverlap');
    const topStyle    = this.mergeStyles ('topOverlap');
    const bottomStyle = this.mergeStyles ('bottomOverlap');
    const endStyle    = this.mergeStyles ('endOverlap');

    return (
      <div>
        <div style = {startStyle} {...this.link ()} />
        <div style = {topStyle} {...this.link ()} />
        <div style = {bottomStyle} {...this.link ()} />
        <div style = {endStyle} {...this.link ()}>
          {this.renderTooltip (hover === 'true')}
        </div>
      </div>
    );
  }

  render () {
    const endFrom = this.read ('endFrom');
    const startTo = this.read ('startTo');

    const a = Unit.parse (endFrom).value;
    const b = Unit.parse (startTo).value;

    if (a <= b) {
      return this.renderDistinct ();
    } else {
      return this.renderOverlap ();
    }
  }
}

/******************************************************************************/
