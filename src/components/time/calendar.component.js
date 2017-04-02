'use strict';

import React from 'react';
import {Action} from 'electrum';
import {Button} from 'electrum-arc';
import Converters from '../polypheme/converters';

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

  componentWillMount () {
    // At first time, initialize internalState.visibleDate with current date.
    var date = this.read ('visible-date');
    if (!date) {
      const now = Converters.getNowFormatedDate ();
      const year  = Converters.getYear  (now);
      const month = Converters.getMonth (now);
      date = Converters.getDate (year, month, 1);
    }
    this.setVisibleDate (date);
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

  // Called when the '<' button is clicked.
  // Modify internalState.visibleDate (fix visible year and month).
  prevMonth () {
    const visibleDate = this.getVisibleDate ();
    const newDate = Converters.addMonths (visibleDate, -1);
    this.setVisibleDate (newDate);
    var x = this.read ('visible-date-changed');
    if (x) {
      x (newDate);
    }
  }

  // Called when the '>' button is clicked.
  // Modify internalState.visibleDate (fix visible year and month).
  nextMonth () {
    const visibleDate = this.getVisibleDate ();
    const newDate = Converters.addMonths (visibleDate, 1);
    this.setVisibleDate (newDate);
    var x = this.read ('visible-date-changed');
    if (x) {
      x (newDate);
    }
  }

  // Called when a [1]..[31] button is clicked.
  setDate (date) {
    const {state} = this.props;
    state.set ('date', date);

    if (this.props.onChange) {
      this.props.onChange (date);
    }
  }

  dateClicked (date) {
    // this.setDate (date);
    const x = this.read ('date-clicked');
    if (x) {
      x (date);
    }
  }

  /******************************************************************************/

  // Return the html for a [1]..[31] button.
  renderButton (date, active, dimmed, weekend, index) {
    const tooltip = Converters.getDisplayedDate (date, false, 'Wdmy');
    return (
      <Button
        key     = {index}
        text    = {Converters.getDay (date)}  // 1..31
        tooltip = {tooltip}
        kind    = 'calendar'
        active  = {active}
        dimmed  = {dimmed}
        weekend = {weekend}
        action  = {() => this.dateClicked (date)}
        {...this.link ()}
      />
    );
  }

  // Return an array of 7 buttons, for a week.
  renderButtons (firstDate, visibleDate, selectedDate, selectedDates) {
    let line = [];
    let i = 0;
    for (i = 0; i < 7; ++i) {  // monday..sunday
      let active  = 'false';
      let dimmed  = 'false';
      let weekend = 'false';
      if (firstDate === selectedDate || (selectedDates && selectedDates.indexOf (firstDate) !== -1)) {
        active = 'true';
      }
      if (Converters.getYear  (firstDate) !== Converters.getYear  (visibleDate) ||
          Converters.getMonth (firstDate) !== Converters.getMonth (visibleDate)) {
        dimmed = 'true';
      }
      if (i >= 5) {  // saturday or sunday ?
        weekend = 'true';
      }

      const button = this.renderButton (firstDate, active, dimmed, weekend, i);
      line.push (button);
      firstDate = Converters.addDays (firstDate, 1);
    }
    return line;
  }

  // Return the html for a line of 7 buttons (for a week).
  renderLineOfButtons (firstDate, visibleDate, selectedDate, selectedDates, index) {
    const style = this.mergeStyles ('line');
    return (
      <div style={style} key={index}>
        {this.renderButtons (firstDate, visibleDate, selectedDate, selectedDates)}
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
  renderColumnOfLines (header, firstDate, visibleDate, selectedDate, selectedDates) {
    let column = [];
    column.push (this.renderHeader (header));
    column.push (this.renderLineOfDOWs ());
    let i = 0;
    for (i = 0; i < 6; ++i) {
      const line = this.renderLineOfButtons (firstDate, visibleDate, selectedDate, selectedDates, i);
      column.push (line);
      firstDate = Converters.addDays (firstDate, 7);
    }
    return column;
  }

  // Retourne all the html content of the calendar.
  renderLines () {
    const selectedDate  = this.read ('date');
    const selectedDates = this.read ('dates');

    const visibleDate = this.getVisibleDate ();
    if (!visibleDate) {
      return null;
    }

    const firstDate = Converters.getCalendarStartDate (visibleDate);
    const header    = Converters.getDisplayedDate (visibleDate, false, 'My');  // 'mai 2016' by example

    const style = this.mergeStyles ('column');
    return (
      <div style={style}>
        {this.renderColumnOfLines (header, firstDate, visibleDate, selectedDate, selectedDates)}
      </div>
    );
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);

    const boxStyle = this.mergeStyles ('box');

    return (
      <div
        disabled = {disabled}
        style    = {boxStyle} >
        {this.renderLines ()}
      </div>
    );
  }
}

/******************************************************************************/
