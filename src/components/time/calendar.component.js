'use strict';

import React from 'react';
import {Action} from 'electrum';
import {Button} from 'electrum-arc';
import Converters from '../polypheme/converters';
import CronParser from 'cron-parser';

/******************************************************************************/

function getDateTime (list, date, time) {
  for (var item of list) {
    if (item.Date === date && (!time || item.Time === time)) {
      return item;
    }
  }
  return null;
}

function pushCron (result, cron, date, deleteList) {
  const year  = Converters.getYear  (date);
  const month = Converters.getMonth (date);
  var options = {
    currentDate: new Date (year, month - 2, 1),
    endDate:     new Date (year, month + 1, 1),
    iterator:    true
  };
  const interval = CronParser.parseExpression (cron, options);
  while (true) {
    const next = interval.next ();
    if (next.done) {
      break;
    }
    const date = Converters.jsToFormatedDate (next.value);
    const time = Converters.jsToFormatedTime (next.value);
    if (getDateTime (deleteList, date, time) === null) {
      const item = {
        Date:  date,
        Time:  time,
        Type: 'default',
      };
      result.push (item);
    }
  }
}

function getRecurrenceList (recurrence, date) {
  const result = [];
  if (recurrence) {
    pushCron (result, recurrence.Cron, date, recurrence.Delete);

    for (var item of recurrence.Add) {
      const it = {
        Date:  item.Date,
        Time:  item.Time,
        Type: 'added',
      };
      result.push (it);
    }
  }
  return result;
}

function getRecurrence (date, recurrenceList) {
  return getDateTime (recurrenceList, date, null);
}

/******************************************************************************/

export default class Calendar extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      visibleDate: null,
    };
  }

  getVisibleDate () {
    return this.state.visibleDate;
  }

  setVisibleDate (value) {
    this.setState ( {
      visibleDate: value
    });
  }

  componentDidMount () {
    // At first time, initialize internalState.visibleDate with current date.
    this.setVisibleDate (this.read ('date'));
  }

  /******************************************************************************/

  get styleProps () {
    return {
      width:   this.read ('width'),
      height:  this.read ('height'),
      kind:    this.read ('kind'),
      spacing: this.read ('spacing'),
    };
  }

  getDOW3Letters (dow) {
    return Converters.getDOWDescription (dow).substring (0, 3);
  }

  // If the input date is undefine, set to now.
  normalizeDate (date) {
    if (date) {
      return date;
    } else {
      return Converters.getNowFormatedDate ();
    }
  }

  // Called when the '<' button is clicked.
  // Modify internalState.visibleDate (fix visible year and month).
  prevMonth () {
    const visibleDate = this.normalizeDate (this.getVisibleDate ());
    this.setVisibleDate (Converters.addMonths (visibleDate, -1));
  }

  // Called when the '>' button is clicked.
  // Modify internalState.visibleDate (fix visible year and month).
  nextMonth () {
    const visibleDate = this.normalizeDate (this.getVisibleDate ());
    this.setVisibleDate (Converters.addMonths (visibleDate, 1));
  }

  // Called when a [1]..[31] button is clicked.
  setDate (date) {
    const {state} = this.props;
    state.set ('date', date);

    if (this.props.onChange) {
      this.props.onChange (date);
    }
  }

  /******************************************************************************/

  // Return the html for a [1]..[31] button.
  renderButton (dateTime, active, dimmed, weekend, recurrence, index) {
    var tooltip;
    if (dateTime.Time) {
      const d = Converters.getDisplayedDate (dateTime.Date, false, 'Wdmy');
      const t = Converters.getDisplayedTime (dateTime.Time, false, 'hm');
      tooltip = d + ', ' + t;
    } else {
      tooltip = Converters.getDisplayedDate (dateTime.Date, false, 'Wdmy');
    }
    return (
      <Button
        key        = {index}
        text       = {Converters.getDay (dateTime.Date)}  // 1..31
        tooltip    = {tooltip}
        kind       = 'calendar'
        active     = {active}
        dimmed     = {dimmed}
        weekend    = {weekend}
        recurrence = {recurrence}
        action     = {() => this.setDate (dateTime.Date)}
        {...this.link ()}
      />
    );
  }

  // Return an array of 7 buttons, for a week.
  renderButtons (firstDate, visibleDate, selectedDate, recurrenceList) {
    let line = [];
    let i = 0;
    for (i = 0; i < 7; ++i) {  // monday..sunday
      let active     = 'false';
      let dimmed     = 'false';
      let weekend    = 'false';
      let recurrence = 'none';
      if (firstDate === selectedDate) {
        active = 'true';
      }
      if (Converters.getYear  (firstDate) !== Converters.getYear  (visibleDate) ||
          Converters.getMonth (firstDate) !== Converters.getMonth (visibleDate)) {
        dimmed = 'true';
      }
      if (i >= 5) {  // saturday or sunday ?
        weekend = 'true';
      }
      let dateTime = getRecurrence (firstDate, recurrenceList);
      if (dateTime === null) {
        dateTime = {Date: firstDate};
      } else {
        recurrence = dateTime.Type;
      }
      const button = this.renderButton (dateTime, active, dimmed, weekend, recurrence, i);
      line.push (button);
      firstDate = Converters.addDays (firstDate, 1);
    }
    return line;
  }

  // Return the html for a line of 7 buttons (for a week).
  renderLineOfButtons (firstDate, visibleDate, selectedDate, recurrenceList, index) {
    const style = this.mergeStyles ('line');
    return (
      <div style={style} key={index}>
        {this.renderButtons (firstDate, visibleDate, selectedDate, recurrenceList)}
      </div>
    );
  }

  // Return the html for the header, with 2 buttons next/prevMonth and the title.
  // By example: '<' mai 2016 '>'
  renderHeader (header) {
    const style     = this.mergeStyles ('header');
    const textStyle = this.mergeStyles ('headerText');
    return (
      <div style={style} key='header'>
        <Button glyph='chevron-left' kind='calendar-navigation' key='prevMonth'
          action={() => this.prevMonth ()}
          {...this.link ()} />
        <div style={textStyle}>
          {header}
        </div>
        <Button glyph='chevron-right' kind='calendar-navigation' key='nextMonth'
          action={() => this.nextMonth ()}
          {...this.link ()} />
      </div>
    );
  }

  // Return the html for a [lun]..[dim] labels.
  renderDOW (text, index) {
    const textStyle = this.mergeStyles ('dowText');
    return (
      <div style={textStyle} key={index}>
        {text}
      </div>
    );
  }

  // Return an array of 7 days of week.
  renderDOWs () {
    let line = [];
    let i = 0;
    for (i = 0; i < 7; ++i) {
      const dow = this.getDOW3Letters (i);
      line.push (this.renderDOW (dow, i));
    }
    return line;
  }

  // Return the html for the 7 days of week header.
  renderLineOfDOWs () {
    const style = this.mergeStyles ('dowLine');
    return (
      <div style={style} key='dows'>
        {this.renderDOWs ()}
      </div>
    );
  }

  // Return an array of lines, with header then week's lines.
  // The array must have from 4 to 6 lines.
  renderColumnOfLines (header, firstDate, visibleDate, selectedDate, recurrenceList) {
    let column = [];
    column.push (this.renderHeader (header));
    column.push (this.renderLineOfDOWs ());
    let i = 0;
    for (i = 0; i < 6; ++i) {
      const line = this.renderLineOfButtons (firstDate, visibleDate, selectedDate, recurrenceList, i);
      column.push (line);
      firstDate = Converters.addDays (firstDate, 7);
    }
    return column;
  }

  // Retourne all the html content of the calendar.
  renderLines (recurrence) {
    const visibleDate  = this.normalizeDate (this.getVisibleDate ());
    const selectedDate = this.normalizeDate (this.read ('date'));
    const firstDate    = Converters.getCalendarStartDate (visibleDate);
    const header       = Converters.getDisplayedDate (visibleDate, false, 'My');  // 'mai 2016' by example

    const recurrenceList = getRecurrenceList (recurrence, visibleDate);

    const style = this.mergeStyles ('column');
    return (
      <div style={style}>
        {this.renderColumnOfLines (header, firstDate, visibleDate, selectedDate, recurrenceList)}
      </div>
    );
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);
    const recurrence = this.read ('recurrence');

    const boxStyle = this.mergeStyles ('box');

    return (
      <div
        disabled = {disabled}
        style    = {boxStyle} >
        {this.renderLines (recurrence)}
      </div>
    );
  }
}

/******************************************************************************/
