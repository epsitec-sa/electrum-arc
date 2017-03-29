'use strict';

import React from 'react';
import {Action} from 'electrum';
import {Button} from 'electrum-arc';
import Converters from '../polypheme/converters';
import CronParser from 'cron-parser';

/******************************************************************************/

function getCronDates (cron) {
  const result = [];
  var options = {
    currentDate: new Date (2017, 0, 1),
    endDate:     new Date (2017, 11, 31),
    iterator:    true
  };
  const interval = CronParser.parseExpression (cron, options);
  while (true) {
    const next = interval.next ();
    if (next.done) {
      break;
    }
    const date = new Date (next.value.getFullYear (), next.value.getMonth (), next.value.getDate ());
    result.push (date);
  }
  return result;
}

function isAddRecurrence (date, recurrence) {
  if (recurrence) {
    for (var r of recurrence.Add) {
      const year  = r.Date.substring (0, 4);
      const month = r.Date.substring (5, 7);
      const day   = r.Date.substring (8, 10);
      const d = new Date (year, month - 1, day);
      if (date.getFullYear () === d.getFullYear () &&
          date.getMonth    () === d.getMonth    () &&
          date.getDate     () === d.getDate     ()) {
        return true;
      }
    }
  }
  return false;
}

function isDeleteRecurrence (date, recurrence) {
  if (recurrence) {
    for (var r of recurrence.Delete) {
      const year  = r.Date.substring (0, 4);
      const month = r.Date.substring (5, 7);
      const day   = r.Date.substring (8, 10);
      const d = new Date (year, month - 1, day);
      if (date.getFullYear () === d.getFullYear () &&
          date.getMonth    () === d.getMonth    () &&
          date.getDate     () === d.getDate     ()) {
        return true;
      }
    }
  }
  return false;
}

function isCronRecurrence (date, cronDates) {
  if (cronDates) {
    for (var d of cronDates) {
      if (date.getFullYear () === d.getFullYear () &&
          date.getMonth    () === d.getMonth    () &&
          date.getDate     () === d.getDate     ()) {
        return true;
      }
    }
  }
  return false;
}

function isRecurrence (date, recurrence, cronDates) {
  if (isAddRecurrence (date, recurrence)) {
    return true;
  } else if (isCronRecurrence (date, cronDates) && !isDeleteRecurrence (date, recurrence)) {
    return true;
  }
  return false;
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
  // If the input date is a number, cast to Date.
  normalizeDate (date) {
    if (date) {
      return new Date (date);
    } else {
      return new Date (Date.now ());
    }
  }

  // Called when the '<' button is clicked.
  // Modify internalState.visibleDate (fix visible year and month).
  prevMonth () {
    const visibleDate = this.normalizeDate (this.getVisibleDate ());
    this.setVisibleDate (new Date (visibleDate.getFullYear (), visibleDate.getMonth () - 1, 1));
  }

  // Called when the '>' button is clicked.
  // Modify internalState.visibleDate (fix visible year and month).
  nextMonth () {
    const visibleDate = this.normalizeDate (this.getVisibleDate ());
    this.setVisibleDate (new Date (visibleDate.getFullYear (), visibleDate.getMonth () + 1, 1));
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
  renderButton (firstDate, active, nature, index) {
    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    return (
      <Button
        key     = {index}
        text    = {firstDate.getDate ()}  // 1..31
        tooltip = {firstDate.toLocaleDateString ('fr-CH', options)}
        kind    = 'calendar'
        active  = {active}
        nature  = {nature}
        action  = {() => this.setDate (firstDate)}
        {...this.link ()}
      />
    );
  }

  // Return an array of 7 buttons, for a week.
  renderButtons (firstDate, visibleDate, selectedDate, recurrence, cronDates) {
    let line = [];
    let i = 0;
    for (i = 0; i < 7; ++i) {
      let active = 'hidden';
      if (firstDate.getFullYear () === visibleDate.getFullYear () &&
          firstDate.getMonth    () === visibleDate.getMonth    ()) {
        active = 'false';
      }
      if (firstDate.getFullYear () === selectedDate.getFullYear () &&
          firstDate.getMonth    () === selectedDate.getMonth    () &&
          firstDate.getDate     () === selectedDate.getDate     ()) {
        active = 'true';
      }
      let nature = (i < 5) ? 'default' : 'weekend';
      if (isRecurrence (firstDate, recurrence, cronDates)) {
        nature = 'recurrence';
      }
      const button = this.renderButton (firstDate, active, nature, i);
      line.push (button);
      firstDate = new Date (firstDate.getFullYear (), firstDate.getMonth (), firstDate.getDate () + 1);
    }
    return line;
  }

  // Return the html for a line of 7 buttons (for a week).
  renderLineOfButtons (firstDate, visibleDate, selectedDate, recurrence, cronDates, index) {
    const style = this.mergeStyles ('line');
    return (
      <div style={style} key={index}>
        {this.renderButtons (firstDate, visibleDate, selectedDate, recurrence, cronDates)}
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
  renderColumnOfLines (header, firstDate, visibleDate, selectedDate, recurrence, cronDates) {
    let column = [];
    column.push (this.renderHeader (header));
    column.push (this.renderLineOfDOWs ());
    let i = 0;
    for (i = 0; i < 6; ++i) {
      const line = this.renderLineOfButtons (firstDate, visibleDate, selectedDate, recurrence, cronDates, i);
      column.push (line);
      firstDate = new Date (firstDate.getFullYear (), firstDate.getMonth (), firstDate.getDate () + 7);
    }
    return column;
  }

  // Retourne all the html content of the calendar.
  renderLines (recurrence) {
    const visibleDate  = this.normalizeDate (this.getVisibleDate ());
    const selectedDate = this.normalizeDate (this.read ('date'));
    const visibleYear  = visibleDate.getFullYear ();  // 2016
    const visibleMonth = visibleDate.getMonth ();  // 0..11
    const dotw         = new Date (visibleYear, visibleMonth, 1).getDay ();  // 0..6 (0 = Sunday)
    const first        = -((dotw + 5) % 7);
    const firstDate    = new Date (visibleYear, visibleMonth, first);
    const header       = Converters.getMonthDescription (visibleMonth) + ' ' + visibleYear;  // 'mai 2016' by example

    const cronDates = recurrence ? getCronDates (recurrence.Cron) : null;

    const style = this.mergeStyles ('column');
    return (
      <div style={style}>
        {this.renderColumnOfLines (header, firstDate, visibleDate, selectedDate, recurrence, cronDates)}
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
