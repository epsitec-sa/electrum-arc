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
    // this.setHover (true);
    const mouseOver = this.read ('mouseOver');
    if (mouseOver) {
      const event = this.read ('event');
      mouseOver (event);
    }
  }

  mouseOut () {
    // this.setHover (false);
    const mouseOut = this.read ('mouseOut');
    if (mouseOut) {
      const event = this.read ('event');
      mouseOut (event);
    }
  }

  /******************************************************************************/

  renderLabel (note, index) {
    const lineWidth  = this.read ('lineWidth');
    const glyphWidth = this.read ('glyphWidth');
    return (
      <ChronoLabel
        index      = {index}
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
    let index = 0;
    if (event.Note) {  // only one note ?
      result.push (this.renderLabel (event.Note));
    } else if (event.Notes) {  // collection of notes ?
      for (var note of event.Notes) {
        result.push (this.renderLabel (note, index++));
      }
    }
    return result;
  }

  render () {
    const index   = this.read ('index');
    const event   = this.read ('event');
    const minHour = this.read ('minHour');
    const maxHour = this.read ('maxHour');

    const hover = this.getHover ();

    const lineStyle      = this.mergeStyles (hover ? 'lineHover' : 'line');
    const lineLabelStyle = this.mergeStyles ('lineLabel');
    const lineEventStyle = this.mergeStyles ('lineEvent');

    return (
      <div style={lineStyle} key={index}>
        <div style={lineLabelStyle} key='label'>
          {this.renderLabels (event)}
        </div>
        <div style={lineEventStyle} key='event'>
          <ChronoEvent
            event     = {event}
            minHour   = {minHour}
            maxHour   = {maxHour}
            mouseOver = {() => this.mouseOver ()}
            mouseOut  = {() => this.mouseOut ()}
            {...this.link ()}/>
        </div>
      </div>
    );
  }
}

/******************************************************************************/
