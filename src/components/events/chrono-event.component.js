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

  /******************************************************************************/

  renderVerticalLine (x) {
    const style = {
      position:        'absolute',
      top:             '0px',
      height:          '100%',
      left:            x,
      width:           '1px',
      backgroundColor: this.props.theme.palette.chronoLineSeparator,
    };
    return (
      <div style={style} ref={x} />
    );
  }

  renderGrid () {
    const result = [];
    for (var h = 0; h < 24 ; h++) {
      const x = ((h + 1) * 100 / 24) + '%';
      result.push (this.renderVerticalLine (x));
    }
    return result;
  }

  renderBar (event) {
    const fromPos = Converters.getMinutes (event.FromTime);
    const   toPos = Converters.getMinutes (event.ToTime);

    const s = this.props.theme.shapes.eventSeparator;
    const left   = (fromPos * 100 / (24 * 60)) + '%';
    const width  = (Math.max (toPos - fromPos, 2) * 100 / (24 * 60)) + '%';
    const top    = s;
    const height = `calc(100% - ${Unit.multiply (s, 2)})`;

    return (
      <ChronoBar
        event  = {event}
        left   = {left}
        width  = {width}
        top    = {top}
        height = {height}
        hover  = {this.getHover () ? 'true' : 'false'}
        {...this.link ()} />
    );
  }

  render () {
    const event = this.read ('event');

    const styleName = this.getHover () ? 'lineHover' : 'line';
    const lineStyle = this.mergeStyles (styleName);

    return (
      <div style={lineStyle}>
        {this.renderGrid ()}
        {this.renderBar (event)}
      </div>
    );
  }
}

/******************************************************************************/
