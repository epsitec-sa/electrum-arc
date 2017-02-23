'use strict';

import React from 'react';
import Converters from '../polypheme/converters';
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

  mouseOver () {
    this.setHover (true);
    const mouseOver = this.read ('mouseOver');
    if (mouseOver) {
      const event = this.read ('event');
      mouseOver (event);
    }
  }

  mouseOut () {
    this.setHover (false);
    const mouseOut = this.read ('mouseOut');
    if (mouseOut) {
      const event = this.read ('event');
      mouseOut (event);
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

  getLeftTooltip (event, tricolor, isTextToLeft) {
    if (tricolor) {
      return this.getPeriod (event.StartFromTime, event.EndFromTime);
    } else {
      if (event.FromTime === event.ToTime && !isTextToLeft) {
        return null;
      } else {
        return this.getPeriod (event.FromTime, event.FromTime);
      }
    }
  }

  getRightTooltip (event, tricolor, isTextToLeft) {
    if (tricolor) {
      return this.getPeriod (event.StartToTime, event.EndToTime);
    } else {
      if (event.FromTime === event.ToTime && isTextToLeft) {
        return null;
      } else {
        return this.getPeriod (event.ToTime, event.ToTime);
      }
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
    const minHour = this.read ('minHour');
    const maxHour = this.read ('maxHour');
    const lenHour = maxHour - minHour;
    for (var h = minHour; h < maxHour ; h++) {
      const x = ((h - minHour + 1) * 100 / lenHour) + '%';
      result.push (this.renderVerticalLine (x));
    }
    return result;
  }

  renderBar (event) {
    const minHour = this.read ('minHour');
    const maxHour = this.read ('maxHour');
    const minMinute = minHour * 60;
    const lenMinute = (maxHour - minHour) * 60;

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
    const isTextToLeft = middle > minMinute + lenMinute / 2;

    // const left   = (fromPos * 100 / (24 * 60)) + '%';
    // const width  = (Math.max (toPos - fromPos, 2) * 100 / (24 * 60)) + '%';
    const startFrom = ((startFromPos - minMinute) * 100 / lenMinute) + '%';
    const endFrom   = ((endFromPos   - minMinute) * 100 / lenMinute) + '%';
    const startTo   = ((startToPos   - minMinute) * 100 / lenMinute) + '%';
    const endTo     = ((endToPos     - minMinute) * 100 / lenMinute) + '%';

    return (
      <ChronoBar
        startFrom    = {startFrom}
        endFrom      = {endFrom}
        startTo      = {startTo}
        endTo        = {endTo}
        color        = {event.Color}
        tricolor     = {tricolor ? 'true' : 'false'}
        leftTooltip  = {this.getLeftTooltip  (event, tricolor, isTextToLeft)}
        rightTooltip = {this.getRightTooltip (event, tricolor, isTextToLeft)}
        hover        = {this.getHover () ? 'true' : 'false'}
        {...this.link ()} />
    );
  }

  render () {
    const event = this.read ('event');

    const lineStyle  = this.mergeStyles ('line');
    const frontStyle = this.mergeStyles ('front');

    return (
      <div style={lineStyle}>
        {this.renderGrid ()}
        {this.renderBar (event)}
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
