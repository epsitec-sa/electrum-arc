'use strict';

import React from 'react';
import Converters from '../polypheme/converters';
import {Unit} from 'electrum-theme';
import {ChronoBar} from '../../all-components.js';

/******************************************************************************/

export default class ChronoEvent extends React.Component {

  constructor (props) {
    super (props);
  }

  /******************************************************************************/

  getNote (event) {
    if (event.Note) {
      return event.Note.Content;
    } else if (event.Notes) {
      var result = '';
      for (var note of event.Notes) {
        if (result) {
          result += ' / ';
        }
        result += note.Content;
      }
      return result;
    } else {
      return null;
    }
  }

  getPeriod (startTime, endTime) {
    const s = Converters.getDisplayedTime (startTime);
    const e = Converters.getDisplayedTime (endTime);
    if (s === e) {
      return s;
    } else {
      return `${s} — ${e}`;
    }
  }

  getLeftTooltip (event, tricolor, isTextToLeft) {
    var period;
    if (event.StartFromTime) {
      period = this.getPeriod (event.StartFromTime, event.EndFromTime);
    } else {
      period = this.getPeriod (event.FromTime, event.FromTime);
    }
    if (isTextToLeft) {
      const n = this.getNote (event);
      if (n) {
        return `${n} : ${period}`;
      }
    }
    return period;
  }

  getRightTooltip (event, tricolor, isTextToLeft) {
    var period;
    if (event.StartToTime) {
      period = this.getPeriod (event.StartToTime, event.EndToTime);
    } else {
      period = this.getPeriod (event.ToTime, event.ToTime);
    }
    if (!isTextToLeft) {
      const n = this.getNote (event);
      if (n) {
        return `${period} : ${n}`;
      }
    }
    return period;
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

  renderBar (event, hover) {
    var startFromPos, endFromPos, startToPos, endToPos, tricolor;
    if (event.StartFromTime) {
      startFromPos = Converters.getMinutes (event.StartFromTime);
      endFromPos   = Converters.getMinutes (event.EndFromTime);
      startToPos   = Converters.getMinutes (event.StartToTime);
      endToPos     = Converters.getMinutes (event.EndToTime);
      tricolor     = true;
    } else {
      startFromPos = Converters.getMinutes (event.FromTime);
      endFromPos   = Converters.getMinutes (event.FromTime);
      startToPos   = Converters.getMinutes (event.ToTime);
      endToPos     = Converters.getMinutes (event.ToTime);
      tricolor     = false;
    }
    const middle = (startFromPos + endFromPos + startToPos + endToPos) / 4;
    const isTextToLeft = middle > (24 * 60) / 2;

    // const left   = (fromPos * 100 / (24 * 60)) + '%';
    // const width  = (Math.max (toPos - fromPos, 2) * 100 / (24 * 60)) + '%';
    const startFrom = (startFromPos * 100 / (24 * 60)) + '%';
    const endFrom   = (endFromPos   * 100 / (24 * 60)) + '%';
    const startTo   = (startToPos   * 100 / (24 * 60)) + '%';
    const endTo     = (endToPos     * 100 / (24 * 60)) + '%';

    return (
      <ChronoBar
        startFrom    = {startFrom}
        endFrom      = {endFrom}
        startTo      = {startTo}
        endTo        = {endTo}
        tricolor     = {tricolor ? 'true' : 'false'}
        leftTooltip  = {this.getLeftTooltip  (event, tricolor, isTextToLeft)}
        rightTooltip = {this.getRightTooltip (event, tricolor, isTextToLeft)}
        hover        = {hover}
        {...this.link ()} />
    );
  }

  render () {
    const event = this.read ('event');
    const hover = this.read ('hover');

    const lineStyle = this.mergeStyles ('line');

    return (
      <div style={lineStyle}>
        {this.renderGrid ()}
        {this.renderBar (event, hover)}
      </div>
    );
  }
}

/******************************************************************************/
