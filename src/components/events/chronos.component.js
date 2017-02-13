'use strict';

import React from 'react';
import Enumerable from 'linq';
import Converters from '../polypheme/converters';
import {Unit} from 'electrum-theme';

import {
  Chrono,
  Label,
  Button
} from '../../all-components.js';

/******************************************************************************/

function shareShiftInfo (events, first, last) {
  const count = last - first + 1;
  for (var i = 0; i < count; i++) {
    const event = events[first + i];
    const n = i % count;
    event.start = ((n + 0) / count) * 100;
    event.end   = ((n + 1) / count) * 100;
    event.group = first;
  }
}

function getGroupShiftInfo (events, i) {
  var count    = 1;
  var fromTime = events[i].FromTime;
  var toTime   = events[i].ToTime;
  var group    = events[i].group;
  if (group) {
    while (--i >= 0) {
      if (events[i].group === group) {
        count++;
        if (fromTime > events[i].FromTime) {
          fromTime = events[i].FromTime;
        }
        if (toTime < events[i].ToTime) {
          toTime = events[i].ToTime;
        }
      } else {
        break;
      }
    }
  }
  return {count: count, fromTime: fromTime, toTime: toTime};
}

function countBackShiftInfo (events, i) {
  var count = 1;
  const time = events[i--].FromTime;
  while (i >= 0) {
    const group = getGroupShiftInfo (events, i);
    if (time >= group.fromTime && time < group.toTime) {
      count += group.count;
      i -= group.count;
    } else {
      break;
    }
  }
  return count;
}

function addShiftInfo (events) {
  for (var i = 0; i < events.length; i++) {
    const count = countBackShiftInfo (events, i);
    shareShiftInfo (events, i - count + 1, i);
  }
}

function addShiftInfos (days) {
  for (var day of days) {
    addShiftInfo (day[1]);
  }
  return days;
}

/******************************************************************************/

export default class Chronos extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      range:    'week',
      scale:    1,
      fromDate: null,
    };
  }

  getRange () {
    return this.state.range;
  }

  setRange (value) {
    this.setState ( {
      range: value
    });
  }

  getScale () {
    return this.state.scale;
  }

  setScale (value) {
    this.setState ( {
      scale: value
    });
  }

  getFromDate () {
    return this.state.fromDate;
  }

  setFromDate (value) {
    this.setState ( {
      fromDate: value
    });
  }

  /******************************************************************************/

  componentWillMount () {
    const data = this.read ('data');
    this.setFromDate (data.FromDate);
  }

  /******************************************************************************/

  getToDate (direction) {
    const date = this.getFromDate ();
    const range = this.getRange ();
    const m = (direction === 'back') ? -1 : 1;
    if (range === 'day') {
      return Converters.addDays (date, 1 * m);
    } else if (range === 'week') {
      return Converters.addDays (date, 7 * m);
    } else if (range === 'month') {
      return Converters.addMonths (date, 1 * m);
    } else {
      return Converters.addYears (date, 1 * m);
    }
  }

  getGroupedByDays (data) {
    const result = new Map ();
    let currentDate = this.getFromDate ();
    const toDate = this.getToDate ();
    while (true) {
      const events = Enumerable
        .from (data.Events)
        .where (e => e.FromDate === currentDate)
        .toArray ();
      result.set (currentDate, events);
      currentDate = Converters.addDays (currentDate, 1);
      if (currentDate === toDate) {
        break;
      }
    }
    return result;
  }

  /******************************************************************************/

  actionPrev () {
    this.setFromDate (this.getToDate ('back'));
  }

  actionNext () {
    this.setFromDate (this.getToDate ('next'));
  }

  actionRange (range) {
    this.setRange (range);
  }

  actionScale (scale) {
    this.setScale (scale);
  }

  /******************************************************************************/

  renderHeaderButton (glyph, text, tooltip, active, action) {
    return (
      <Button
        glyph   = {glyph}
        text    = {text}
        tooltip = {tooltip}
        border  = 'none'
        active  = {active ? 'true' : 'false'}
        action  = {() => action ()}
        {...this.link ()} />
    );
  }

  renderHeader (header) {
    const headerStyle = this.mergeStyles ('header');
    const textStyle   = this.mergeStyles ('headerText');

    const range = this.getRange ();
    const scale = this.getScale ();

    return (
      <div style = {headerStyle}>
        {this.renderHeaderButton ('chevron-left',  null, null, false, () => this.actionPrev ())}
        {this.renderHeaderButton ('chevron-right', null, null, false, () => this.actionNext ())}
        <div style = {textStyle}>
          {header}
        </div>
        {this.renderHeaderButton (null, '1',   'Jour',    range === 'day',   () => this.actionRange ('day'))}
        {this.renderHeaderButton (null, '7',   'Semaine', range === 'week',  () => this.actionRange ('week'))}
        {this.renderHeaderButton (null, '31',  'Mois',    range === 'month', () => this.actionRange ('month'))}
        {this.renderHeaderButton (null, '365', 'Année',   range === 'year',  () => this.actionRange ('year'))}
        {this.renderHeaderButton (null, '÷2', null, scale === 0.5, () => this.actionScale (0.5))}
        {this.renderHeaderButton (null, '×1', null, scale === 1, () => this.actionScale (1))}
        {this.renderHeaderButton (null, '×2', null, scale === 2, () => this.actionScale (2))}
        {this.renderHeaderButton (null, '×3', null, scale === 3, () => this.actionScale (3))}
        {this.renderHeaderButton (null, '×4', null, scale === 4, () => this.actionScale (4))}
        {this.renderHeaderButton (null, '×10', null, scale === 10, () => this.actionScale (10))}
        {this.renderHeaderButton (null, '×20', null, scale === 20, () => this.actionScale (20))}
      </div>
    );
  }

  renderText (text, index) {
    const style = this.mergeStyles ('topDow');
    return (
      <div style = {style} key = {index}>
        <Label text={text} grow='1' {...this.link ()} />
      </div>
    );
  }

  renderDow (date, index) {
    const dowStyle = this.mergeStyles ('dow');
    const h = Converters.getDisplayedDate (date, false, 'Wd');

    return (
      <div style = {dowStyle} key = {index}>
        <Label text={h} justify='center' grow='1' {...this.link ()} />
      </div>
    );
  }

  renderWeekDowsList (days) {
    const result = [];
    let index = 0;
    result.push (this.renderText ('', index++));
    for (var day of days) {
      result.push (this.renderDow (day[0], index++));
    }
    return result;
  }

  renderWeekDows (days) {
    const dowsStyle = this.mergeStyles ('dows');
    return (
      <div style = {dowsStyle}>
        {this.renderWeekDowsList (days)}
      </div>
    );
  }

  renderZone (start, end) {
    const width = Unit.sub (end, start);
    const style = {
      position:        'absolute',
      top:             '0px',
      height:          '100%',
      left:            start,
      width:           width,
      backgroundColor: this.props.theme.palette.eventOddBackground,
    };
    return (
      <div style={style} />
    );
  }

  renderGrid () {
    const result = [];
    const scale = this.getScale ();
    for (var h = 0; h < 24 ; h++) {
      if (h % 2 === 1) {
        const start = ((h + 0) * 60 * scale) + 'px';
        const end   = ((h + 1) * 60 * scale) + 'px';
        result.push (this.renderZone (start, end));
      }
    }
    return result;
  }

  renderTime (start, end, time, index) {
    const width = Unit.sub (end, start);
    const style = {
      position:        'absolute',
      top:             '0px',
      height:          '100%',
      left:            start,
      width:           width,
      backgroundColor: this.props.theme.palette.eventOddBackground,
    };
    const text = Converters.getDisplayedTime (Converters.addSeconds (time, 1), false, 'h');

    return (
      <div style={style} ref={index}>
        <Label text={text} justify='center' grow='1' {...this.link ()} />
      </div>
    );
  }

  renderEvent (event, index) {
    const scale = this.getScale ();
    const from = Converters.getMinutes (event.FromTime) * scale;
    const   to = Converters.getMinutes (event.ToTime)   * scale;

    const left   = from + 'px';
    const width  = Math.max ((to - from) - 1, 2) + 'px';
    const top    = (event.start) + '%';
    const height = (event.end - event.start) + '%';

    return (
      <Chrono
        key    = {index}
        event  = {event}
        left   = {left}
        width  = {width}
        top    = {top}
        height = {height}
        {...this.link ()} />
    );
  }

  renderEvents (events) {
    const result = [];
    let index = 0;
    for (var event of events) {
      result.push (this.renderEvent (event, index++));
    }
    return result;
  }

  renderWeekDay (day, index) {
    const rowStyle = this.mergeStyles ('row');
    return (
      <div style = {rowStyle} key = {index}>
        {this.renderGrid ()}
        {this.renderEvents (day[1])}
      </div>
    );
  }

  renderTimesList () {
    const result = [];
    let index = 0;
    const scale = this.getScale ();
    for (var h = 0 ; h < 24; h++) {
      const start = ((h + 0) * 60 * scale) + 'px';
      const end   = ((h + 1) * 60 * scale) + 'px';
      const time = Converters.getTimeFromMinutes (h * 60);
      result.push (this.renderTime (start, end, time, index++));
    }
    return result;
  }

  renderTimes (index) {
    const style = this.mergeStyles ('topRow');
    return (
      <div style = {style} ref = {index}>
        {this.renderTimesList ()}
      </div>
    );
  }

  renderWeekDaysList (days) {
    const result = [];
    let index = 0;
    result.push (this.renderTimes (index++));
    for (var day of days) {
      result.push (this.renderWeekDay (day, index++));
    }
    return result;
  }

  renderWeekDays (days) {
    const style = this.mergeStyles ('column');
    return (
      <div style = {style}>
        {this.renderWeekDaysList (days)}
      </div>
    );
  }

  /******************************************************************************/

  renderDay (data) {
    const boxStyle     = this.mergeStyles ('box');
    const contentStyle = this.mergeStyles ('content');

    const h = Converters.getDisplayedDate (this.getFromDate (), false, 'My');
    const days = addShiftInfos (this.getGroupedByDays (data));

    return (
      <div style = {boxStyle}>
        {this.renderHeader (h)}
        <div style = {contentStyle}>
          {this.renderWeekDows (days)}
          {this.renderWeekDays (days)}
        </div>
      </div>
    );
  }

  renderWeek (data) {
    const boxStyle     = this.mergeStyles ('box');
    const contentStyle = this.mergeStyles ('content');

    const h = Converters.getDisplayedDate (this.getFromDate (), false, 'My');
    const days = addShiftInfos (this.getGroupedByDays (data));

    return (
      <div style = {boxStyle}>
        {this.renderHeader (h)}
        <div style = {contentStyle}>
          {this.renderWeekDows (days)}
          {this.renderWeekDays (days)}
        </div>
      </div>
    );
  }

  renderMonth (data) {
    const boxStyle = this.mergeStyles ('box');
    const rowStyle = this.mergeStyles ('row');

    const h = Converters.getDisplayedDate (this.getFromDate (), false, 'My');

    return (
      <div style = {boxStyle}>
        {this.renderHeader (h)}
        <div style = {rowStyle}>
        </div>
      </div>
    );
  }

  renderYear (data) {
    const boxStyle = this.mergeStyles ('box');
    const rowStyle = this.mergeStyles ('row');

    const h = Converters.getDisplayedDate (this.getFromDate (), false, 'y');

    return (
      <div style = {boxStyle}>
        {this.renderHeader (h)}
        <div style = {rowStyle}>
        </div>
      </div>
    );
  }

  render () {
    const data = this.read ('data');
    const range = this.getRange ();

    if (range === 'day') {
      return this.renderDay (data);
    } else if (range === 'week') {
      return this.renderWeek (data);
    } else if (range === 'month') {
      return this.renderMonth (data);
    } else {
      return this.renderYear (data);
    }
  }
}

/******************************************************************************/
