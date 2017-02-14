'use strict';

import React from 'react';
import Converters from '../polypheme/converters';
import {Label} from '../../all-components.js';

/******************************************************************************/

export default class ChronoBar extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      hover: false,
    };
  }

  get styleProps () {
    return {
      left:   this.read ('left'),
      width:  this.read ('width'),
      top:    this.read ('top'),
      height: this.read ('height'),
    };
  }

  getHover () {
    return this.state.hover;
  }

  setHover (value) {
    this.setState ( {
      hover: value
    });
  }

  mouseOver () {
    this.setHover (true);
  }

  mouseOut () {
    this.setHover (false);
  }

  getTooltip (event) {
    const f = Converters.getDisplayedTime (event.FromTime);
    const t = Converters.getDisplayedTime (event.ToTime);
    const n = event.Note.Content;
    if (n) {
      return `${f} — ${t} : ${n}`;
    } else {
      return `${f} — ${t}`;
    }
  }

  // If hover. draw a 'tooltip' on the right side of bar.
  renderTooltip (event) {
    if (this.getHover ()) {
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

    const style = this.mergeStyles (this.getHover () ? 'hover' : 'base');
    // const style = this.mergeStyles ('base');

    return (
      <div
        style       = {style}
        onMouseOver = {() => this.mouseOver ()}
        onMouseOut  = {() => this.mouseOut ()}
        {...this.link ()}>
        {this.renderTooltip (event)}
      </div>
    );
  }
}

/******************************************************************************/
