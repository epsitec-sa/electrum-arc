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
      left:   this.read ('left'),
      width:  this.read ('width'),
      top:    this.read ('top'),
      height: this.read ('height'),
    };
  }

  getTooltip (event) {
    const f = Converters.getDisplayedTime (event.FromTime);
    const t = Converters.getDisplayedTime (event.ToTime);
    var period;
    if (f === t) {
      period = f;
    } else {
      period = `${f} — ${t}`;
    }
    const n = event.Note.Content;
    if (n) {
      return `${period} : ${n}`;
    } else {
      return period;
    }
  }

  // If hover. draw a 'tooltip' on the right side of bar.
  renderTooltip (event, hover) {
    if (hover) {
      const style = this.mergeStyles ('tooltip');
      return (
        <div style={style}>
          <Label text={this.getTooltip (event)} wrap='no' {...this.link ()} />
        </div>
      );
    } else {
      return null;
    }
  }

  render () {
    const event = this.read ('event');
    const hover = this.read ('hover');

    const style = this.mergeStyles ('base');

    return (
      <div
        style = {style}
        {...this.link ()}>
        {this.renderTooltip (event, hover === 'true')}
      </div>
    );
  }
}

/******************************************************************************/
