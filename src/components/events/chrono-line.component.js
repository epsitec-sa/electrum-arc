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

  mouseOver () {
    this.setHover (true);
  }

  mouseOut () {
    this.setHover (false);
  }

  /******************************************************************************/

  renderLabel (note) {
    const lineWidth  = this.read ('lineWidth');
    const glyphWidth = this.read ('glyphWidth');
    return (
      <ChronoLabel
        note       = {note}
        lineWidth  = {lineWidth}
        glyphWidth = {glyphWidth}
        mouseOver  = {() => this.mouseOver ()}
        mouseOut   = {() => this.mouseOut ()}
        {...this.link ()}/>
    );
  }

  renderLabels (event) {
    const result = [];
    if (event.Note) {  // only one note ?
      result.push (this.renderLabel (event.Note));
    } else if (event.Notes) {  // collection of notes ?
      for (var note of event.Notes) {
        result.push (this.renderLabel (note));
      }
    }
    return result;
  }

  render () {
    const event = this.read ('event');

    const hover = this.getHover ();

    const lineStyle      = this.mergeStyles (hover ? 'lineHover' : 'line');
    const lineLabelStyle = this.mergeStyles ('lineLabel');
    const lineEventStyle = this.mergeStyles ('lineEvent');

    return (
      <div style={lineStyle}>
        <div style={lineLabelStyle}>
          {this.renderLabels (event)}
        </div>
        <div style={lineEventStyle}>
          <ChronoEvent
            event     = {event}
            mouseOver = {() => this.mouseOver ()}
            mouseOut  = {() => this.mouseOut ()}
            {...this.link ()}/>
        </div>
      </div>
    );
  }
}

/******************************************************************************/
