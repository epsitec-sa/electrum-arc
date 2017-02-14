'use strict';

import React from 'react';
import Converters from '../polypheme/converters';
import {Unit} from 'electrum-theme';
import {ChronoBar} from '../../all-components.js';

/******************************************************************************/

export default class ChronoEvent extends React.Component {

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
    if (!window.document.chronoEvents) {
      window.document.chronoEvents = [];
    }
    window.document.chronoEvents.push (this);
  }

  componentWillUnmount () {
    const index = window.document.chronoEvents.indexOf (this);
    if (index !== -1) {
      window.document.chronoEvents.splice (index, 1);
    }
  }

  mouseOver (event) {
    const mouseOver = this.read ('mouseOver');
    if (mouseOver) {
      mouseOver (event);
    }
  }

  mouseOut (event) {
    const mouseOut = this.read ('mouseOut');
    if (mouseOut) {
      mouseOut (event);
    }
  }

  /******************************************************************************/

  renderLine (top, width) {
    const style = {
      position:        'absolute',
      top:             top,
      height:          '1px',
      left:            '0px',
      width:           width,
      backgroundColor: this.props.theme.palette.chronoLineSeparator,
    };
    return (
      <div style={style} />
    );
  }

  renderHover (event, width) {
    const bc = this.getHover () ? this.props.theme.palette.chronoHover : null;
    const style = {
      position:        'absolute',
      top:             '0px',
      height:          '100%',
      left:            '0px',
      width:           width,
      backgroundColor: bc,
    };
    return (
      <div
        style       = {style}
        onMouseOver = {() => this.mouseOver (event)}
        onMouseOut  = {() => this.mouseOut (event)}
        />
    );
  }

  renderBar (event, scale) {
    const fromPos = Converters.getMinutes (event.FromTime) * scale;
    const   toPos = Converters.getMinutes (event.ToTime)   * scale;

    const s = this.props.theme.shapes.eventSeparator;
    const left   = fromPos + 'px';
    const width  = Math.max ((toPos - fromPos), 5) + 'px';
    const top    = s;
    const height = `calc(100% - ${Unit.multiply (s, 2)})`;

    return (
      <ChronoBar
        event  = {event}
        left   = {left}
        width  = {width}
        top    = {top}
        height = {height}
        {...this.link ()} />
    );
  }

  render () {
    const event = this.read ('event');
    const scale = this.read ('scale');

    const lineStyle = this.mergeStyles ('line');
    const width = (24 * 60 * scale) + 'px';

    return (
      <div
        style       = {lineStyle}
        >
        {this.renderHover (event, width)}
        {this.renderLine (this.props.theme.shapes.chronosLineHeight, width)}
        {this.renderBar (event, scale)}
      </div>
    );
  }
}

/******************************************************************************/
