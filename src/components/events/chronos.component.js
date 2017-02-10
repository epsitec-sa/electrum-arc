'use strict';

import React from 'react';
import Enumerable from 'linq';
import Converters from '../polypheme/converters';

import {
  Chrono,
  Label,
  Button
} from '../../all-components.js';

/******************************************************************************/

export default class Chronos extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      range:    'week',
      scale:    2,
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

  addShiftInfo (events) {
    for (var i = 0; i < events.length; i++) {
      const event = events[i];
      event.position = i % 3;
      event.count = 3;
    }
  }

  addShiftInfos (days) {
    for (var day of days) {
      this.addShiftInfo (day[1]);
    }
    return days;
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

  renderDow (date, index) {
    const dowStyle = this.mergeStyles ('dow');
    const h = Converters.getDisplayedDate (date, false, 'Wd');

    return (
      <div style = {dowStyle} key = {index}>
        <Label text={h} justify='center' grow='1' {...this.link ()} />
      </div>
    );
  }

  renderWeekDows (days) {
    const result = [];
    let index = 0;
    for (var day of days) {
      result.push (this.renderDow (day[0], index++));
    }
    return result;
  }

  renderHeaderWeekDows (days) {
    const dowsStyle = this.mergeStyles ('dows');
    return (
      <div style = {dowsStyle}>
        {this.renderWeekDows (days)}
      </div>
    );
  }

  renderEvent (event, index) {
    const scale = this.getScale ();
    const from = Converters.getMinutes (event.FromTime) * scale;
    const   to = Converters.getMinutes (event.ToTime)   * scale;

    const top    = from;
    const height = Math.max ((to - from) - 1, 2);

    const style = {
      position: 'relative',
      left:     ((100 / event.count) * event.position) + '%',
      width:    (100 / event.count) + '%',
      top:      top,
      height:   '0px',
    };

    return (
      <div style = {style}>
        <Chrono
          key    = {index}
          event  = {event}
          height = {height}
          {...this.link ()} />
      </div>
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
    const columnStyle = this.mergeStyles ('column');
    return (
      <div style = {columnStyle} key = {index}>
        {this.renderEvents (day[1])}
      </div>
    );
  }

  renderWeekDaysList (days) {
    const result = [];
    let index = 0;
    for (var day of days) {
      result.push (this.renderWeekDay (day, index++));
    }
    return result;
  }

  renderWeekDays (days) {
    const style = this.mergeStyles ('row');
    return (
      <div style = {style}>
        {this.renderWeekDaysList (days)}
      </div>
    );
  }

  /******************************************************************************/

  renderDay (data) {
    const boxStyle = this.mergeStyles ('box');
    const rowStyle = this.mergeStyles ('row');

    const h = Converters.getDisplayedDate (this.getFromDate (), false, 'W');

    return (
      <div style = {boxStyle}>
        {this.renderHeader (h)}
        <div style = {rowStyle}>
        </div>
      </div>
    );
  }

  renderWeek (data) {
    const boxStyle = this.mergeStyles ('box');

    const h = Converters.getDisplayedDate (this.getFromDate (), false, 'My');
    const days = this.addShiftInfos (this.getGroupedByDays (data));

    return (
      <div style = {boxStyle}>
        {this.renderHeader (h)}
        {this.renderHeaderWeekDows (days, false)}
        {this.renderWeekDays (days)}
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
