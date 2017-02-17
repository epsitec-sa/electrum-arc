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

  getPeriod (startTime, endTime) {
    const s = Converters.getDisplayedTime (startTime);
    const e = Converters.getDisplayedTime (endTime);
    if (s === e) {
      return s;
    } else {
      return `${s} — ${e}`;
    }
  }

  getTooltip (event) {
    var period;
    if (event.StartFromTime) {
      const s = this.getPeriod (event.StartFromTime, event.EndFromTime);
      const e = this.getPeriod (event.StartToTime, event.EndToTime);
      period = `${s} / ${e}`;
    } else {
      period = this.getPeriod (event.FromTime, event.ToTime);
    }
    const n = event.Note.Content;
    if (n) {
      return `${period} : ${n}`;
    } else {
      return period;
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
    var startFromPos, endFromPos, startToPos, endToPos;
    if (event.StartFromTime) {
      startFromPos = Converters.getMinutes (event.StartFromTime);
      endFromPos   = Converters.getMinutes (event.EndFromTime);
      startToPos   = Converters.getMinutes (event.StartToTime);
      endToPos     = Converters.getMinutes (event.EndToTime);
    } else {
      startFromPos = Converters.getMinutes (event.FromTime);
      endFromPos   = Converters.getMinutes (event.FromTime);
      startToPos   = Converters.getMinutes (event.ToTime);
      endToPos     = Converters.getMinutes (event.ToTime);
    }

    // const left   = (fromPos * 100 / (24 * 60)) + '%';
    // const width  = (Math.max (toPos - fromPos, 2) * 100 / (24 * 60)) + '%';
    const startFrom = (startFromPos * 100 / (24 * 60)) + '%';
    const endFrom   = (endFromPos   * 100 / (24 * 60)) + '%';
    const startTo   = (startToPos   * 100 / (24 * 60)) + '%';
    const endTo     = (endToPos     * 100 / (24 * 60)) + '%';

    return (
      <ChronoBar
        startFrom = {startFrom}
        endFrom   = {endFrom}
        startTo   = {startTo}
        endTo     = {endTo}
        tooltip   = {this.getTooltip (event)}
        hover     = {this.getHover () ? 'true' : 'false'}
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
