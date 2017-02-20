'use strict';

import React from 'react';
import {ChronoLabel, ChronoEvent} from '../../all-components.js';

/******************************************************************************/

export default class ChronoLine extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      hover: false,
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

  /******************************************************************************/

  componentDidMount () {
    if (!window.document.chronoLines) {
      window.document.chronoLines = [];
    }
    window.document.chronoLines.push (this);
  }

  componentWillUnmount () {
    const index = window.document.chronoLines.indexOf (this);
    if (index !== -1) {
      window.document.chronoLines.splice (index, 1);
    }
  }

  mouseOver () {
    const mouseOver = this.read ('mouseOver');
    if (mouseOver) {
      const event = this.read ('event');
      mouseOver (event);
    }
  }

  mouseOut () {
    const mouseOut = this.read ('mouseOut');
    if (mouseOut) {
      const event = this.read ('event');
      mouseOut (event);
    }
  }

  /******************************************************************************/

  render () {
    const event = this.read ('event');

    const hover = this.getHover ();

    const lineStyle      = this.mergeStyles (hover ? 'lineHover' : 'line');
    const lineLabelStyle = this.mergeStyles ('lineLabel');
    const lineEventStyle = this.mergeStyles ('lineEvent');
    const frontStyle     = this.mergeStyles ('front');

    return (
      <div style={lineStyle}>
        <div style={lineLabelStyle}>
          <ChronoLabel
            event = {event}
            hover = {hover ? 'true' : 'false'}
            {...this.link ()}/>
        </div>
        <div style={lineEventStyle}>
          <ChronoEvent
            event = {event}
            hover = {hover ? 'true' : 'false'}
            {...this.link ()}/>
        </div>
        <div
          style       = {frontStyle}
          onMouseOver = {() => this.mouseOver ()}
          onMouseOut  = {() => this.mouseOut ()}
          />
      </div>
    );
  }
}

/******************************************************************************/
