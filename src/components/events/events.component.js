'use strict';

import React from 'react';
import Enumerable from 'linq';
import {ColorManipulator} from 'electrum';
import Converters from '../polypheme/converters';

import {
  Ticket,
  Container,
  Event,
  Label,
  Button
} from '../../all-components.js';

/******************************************************************************/

// value =  '1', decimals = 3  -> return '001'
// value =  'a', decimals = 3  -> return null
// value =    5, decimals = 3  -> return '005'
// value =   12, decimals = 3  -> return '012'
// value = 1234, decimals = 3  -> return null
function padding (value, decimals) {
  if (typeof value === 'string') {
    value = parseInt (value);
    if (isNaN (value)) {
      return null;
    }
  }
  const result = value.toLocaleString ('en-US', {minimumIntegerDigits: decimals, useGrouping: false});
  if (result.length > decimals) {
    return null;
  } else {
    return result;
  }
}

function DateToString (date) {
  return padding (date.getFullYear (), 4) + '-' + padding (date.getMonth () + 1, 2) + '-' + padding (date.getDate (), 2);
}

function StringToDate (date) {
  return new Date (date);
}

function nextDay (date) {
  const d = StringToDate (date);
  const nd = new Date (d.getFullYear (), d.getMonth (), d.getDate () + 1);
  return DateToString (nd);
}

/******************************************************************************/

export default class Events extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      range:    'week',
      fromDate: null,
      hover:    false,
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

  getFromDate () {
    return this.state.fromDate;
  }

  setFromDate (value) {
    this.setState ( {
      fromDate: value
    });
  }

  getHover () {
    return this.state.hover;
  }

  setHover (value) {
    this.setState ( {
      hover: value
    });
  }

  getDays (data) {
    const result = new Map ();
    let currentDate = data.FromDate;
    const toDate = nextDay (data.ToDate);
    let i = 0;
    while (true) {
      const events = Enumerable
        .from (data.Events)
        .where (e => e.FromDate === currentDate)
        .toArray ();
      result.set (currentDate, events);
      currentDate = nextDay (currentDate);
      if (currentDate === toDate || i++ > 100) {
        break;
      }
    }
    return result;
  }

  mouseOver () {
    this.setHover (true);
  }

  mouseOut () {
    this.setHover (false);
  }

  actionPrev () {
  }

  actionNext () {
  }

  actionRange (range) {
    this.setRange (range);
  }

  renderHeaderButton (glyph, tooltip, active, action) {
    return (
      <Button
        glyph   = {glyph}
        tooltip = {tooltip}
        border  = 'none'
        active  = {active ? 'true' : 'false'}
        action  = {() => action ()}
        {...this.link ()} />
    );
  }

  renderHeader (header) {
    const style     = this.mergeStyles ('header');
    const textStyle = this.mergeStyles ('headerText');

    const range = this.getRange ();

    return (
      <div style = {style}>
        {this.renderHeaderButton ('chevron-left',  null, false, () => this.actionPrev ())}
        {this.renderHeaderButton ('chevron-right', null, false, () => this.actionNext ())}
        <div style = {textStyle}>
          {header}
        </div>
        {this.renderHeaderButton ('square-o',   'Jour',    range === 'day',   () => this.actionRange ('day'))}
        {this.renderHeaderButton ('bars',       'Semaine', range === 'week',  () => this.actionRange ('week'))}
        {this.renderHeaderButton ('calendar-o', 'Mois',    range === 'month', () => this.actionRange ('month'))}
        {this.renderHeaderButton ('calendar',   'Année',   range === 'year',  () => this.actionRange ('year'))}
      </div>
    );
  }

  renderEvent (event, index) {
    return (
      <Event key={index} event={event} {...this.link ()} />
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

  renderDOW (date) {
    const dowTextStyle = this.mergeStyles ('dowText');

    const d = StringToDate (date).getDay ();  // 0..6 (0 = Sunday)
    const h = Converters.getDOWDescription ((d + 6) % 7).substring (0, 3);

    return (
      <div style = {dowTextStyle}>
        {h}
      </div>
    );
  }

  renderWeekDay (day, index) {
    const columnStyle = this.mergeStyles ('column');

    return (
      <div style = {columnStyle} key = {index}>
        {this.renderDOW (day[0])}
        {this.renderEvents (day[1])}
      </div>
    );
  }

  renderWeekDays (data) {
    const result = [];
    let index = 0;
    const days = this.getDays (data);
    for (var day of days) {
      result.push (this.renderWeekDay (day, index++));
    }
    return result;
  }

  renderDay (data) {
    const boxStyle = this.mergeStyles ('box');
    const rowStyle = this.mergeStyles ('row');

    const d = StringToDate (data.FromDate).getDay ();  // 0..6 (0 = Sunday)
    const h = Converters.getDOWDescription ((d + 6) % 7) + ' ' + Converters.getDisplayedDate (data.FromDate);

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
    const rowStyle = this.mergeStyles ('row');

    const f = Converters.getDisplayedDate (data.FromDate);
    const t = Converters.getDisplayedDate (data.ToDate);
    const h = f + ' — ' + t;

    return (
      <div style = {boxStyle}>
        {this.renderHeader (h)}
        <div style = {rowStyle}>
          {this.renderWeekDays (data)}
        </div>
      </div>
    );
  }

  renderMonth (data) {
    const boxStyle = this.mergeStyles ('box');
    const rowStyle = this.mergeStyles ('row');

    const h = Converters.getDisplayedDate (data.FromDate, false, 'My');

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

    const h = Converters.getDisplayedDate (data.FromDate, false, 'y');

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
