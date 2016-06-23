'use strict';

import React from 'react';
import {Action} from 'electrum';
import {Button} from 'electrum-arc';

/******************************************************************************/

export default class Calendar extends React.Component {

  constructor (props) {
    super (props);
  }

  get styleProps () {
    return {
      width:      this.read ('width'),
      height:     this.read ('height'),
      kind:       this.read ('kind'),
      heightType: this.read ('height-type'),
      spacing:    this.read ('spacing'),
    };
  }

  // TODO: Move to helpers class, or ?
  // month is zero based (0 = january).
  getMonthDescription (month) {
    const array = [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ];
    return array[month];
  }

  // TODO: Move to helpers class, or ?
  // dow is zero based (0 = monday).
  getDOWDescription (dow) {
    const array = [
      'lundi',
      'mardi',
      'mercredi',
      'jeudi',
      'vendredi',
      'samedi',
      'dimanche',
    ];
    return array[dow];
  }

  getDOW3Letters (dow) {
    return this.getDOWDescription (dow).substring (0, 3);
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

  // Return the number of days in a month (28..31).
  daysInMonth (year, month) {
    return new Date (year, month + 1, 0).getDate ();
  }

  // Return the internalState with contain the visibleDate.
  // internalState.visibleDate fix the visible year and month.
  getInternalState () {
    const {state} = this.props;
    return state.select ('calendar-internal');
  }

  // Return the html for a [1]..[31] button.
  getButton (n, key, active) {
    if (n <= 0) {
      n = null;  // if n <= 0, the button is hidden, but occupy his space
    }
    return (
      <Button
        key     = {key}
        text    = {n}
        kind    = 'calendar'
        active  = {active}
        spacing = 'overlap'
        action  = {() => this.setDate (n)}
        {...this.link ()}
      />
    );
  }

  // Return an array of 7 buttons, for a week.
  getButtons (first, daysInMonth, selectedDay) {
    let line = [];
    let i = 0;
    for (i = 0; i < 7; ++i) {
      let n = first + i;
      const key = n;
      if (n > daysInMonth) {
        n = -1;  // hidden button
      }
      const active = (n > 0 ? (selectedDay === n ? 'true' : 'false') : 'hidden');
      const button = this.getButton (n, key, active);
      line.push (button);
    }
    return line;
  }

  // Return the html for a line of 7 buttons (for a week).
  getLineOfButtons (first, daysInMonth, selectedDay) {
    const style = this.mergeStyles ('line');
    return (
      <div style={style}>
        {this.getButtons (first, daysInMonth, selectedDay)}
      </div>
    );
  }

  // Return the html for the header, with 2 buttons next/prevMonth and the title.
  // By example: '<' mai 2016 '>'
  getHeader (header) {
    const style     = this.mergeStyles ('header');
    const textStyle = this.mergeStyles ('headerText');
    return (
      <div style={style}>
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
  getDOW (text) {
    const textStyle = this.mergeStyles ('dowText');
    return (
      <div style={textStyle}>
        {text}
      </div>
    );
  }

  // Return an array of 7 days of week.
  getDOWs () {
    let line = [];
    let i = 0;
    for (i = 0; i < 7; ++i) {
      const dow = this.getDOW3Letters (i);
      const x = this.getDOW (dow);
      line.push (x);
    }
    return line;
  }

  // Return the html for the 7 days of week header.
  getLineOfDOWs () {
    const style = this.mergeStyles ('dowLine');
    return (
      <div style={style}>
        {this.getDOWs ()}
      </div>
    );
  }

  // Return an array of lines, with header then week's lines.
  // The array must have from 4 to 6 lines.
  getColumnOfLines (header, first, daysInMonth, selectedDay) {
    let column = [];
    column.push (this.getHeader (header));
    column.push (this.getLineOfDOWs ());
    let i = 0;
    for (i = 0; i < 6; ++i) {
      const n = first + i * 7;
      if (n > -6 && n <= daysInMonth) {
        const line = this.getLineOfButtons (n, daysInMonth, selectedDay);
        column.push (line);
      }
    }
    return column;
  }

  // Retourne all the html content of the calendar.
  getLines () {
    const internalState = this.getInternalState ();
    const visibleDate   = this.normalizeDate (internalState.get ('visibleDate'));
    const visibleYear   = visibleDate.getFullYear ();
    const visibleMonth  = visibleDate.getMonth ();
    const dotw          = new Date (visibleYear, visibleMonth, 1).getDay ();  // 0..6 (0 = Sunday)
    const first         = -((dotw + 5) % 7);
    const daysInMonth   = this.daysInMonth (visibleYear, visibleMonth);
    const header        = this.getMonthDescription (visibleMonth) + ' ' + visibleYear;  // 'mai 2016' by example

    var selectedDate  = this.normalizeDate (this.read ('date'));
    var selectedDay = -1;
    if (selectedDate.getFullYear () === visibleDate.getFullYear () &&
        selectedDate.getMonth ()    === visibleDate.getMonth ()) {
      selectedDay = selectedDate.getDate ();
    }

    const style = this.mergeStyles ('column');
    return (
      <div style={style}>
        {this.getColumnOfLines (header, first, daysInMonth, selectedDay)}
      </div>
    );
  }

  // Called when the '<' button is clicked.
  // Modify internalState.visibleDate (fix visible year and month).
  prevMonth () {
    const internalState = this.getInternalState ();
    const visibleDate = this.normalizeDate (internalState.get ('visibleDate'));
    internalState.set ('visibleDate', new Date (visibleDate.getFullYear (), visibleDate.getMonth () - 1, 1));
  }

  // Called when the '>' button is clicked.
  // Modify internalState.visibleDate (fix visible year and month).
  nextMonth () {
    const internalState = this.getInternalState ();
    const visibleDate = this.normalizeDate (internalState.get ('visibleDate'));
    internalState.set ('visibleDate', new Date (visibleDate.getFullYear (), visibleDate.getMonth () + 1, 1));
  }

  // Called when a [1]..[31] button is clicked.
  setDate (n) {
    if (!n) {
      return;  // nothing to do for hidden button
    }

    const {state} = this.props;
    const internalState = this.getInternalState ();
    const visibleDate = this.normalizeDate (internalState.get ('visibleDate'));
    const newDate = new Date (visibleDate.getFullYear (), visibleDate.getMonth (), n);
    state.set ('date', newDate);

    if (this.props.onChange) {
      this.props.onChange (newDate);
    }
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);

    // Get or create the internalState.
    var internalState = this.getInternalState ();
    if (!internalState.get ('visibleDate')) {
      // At first time, initialize internalState.visibleDate with current date.
      internalState = internalState.set ('visibleDate', this.read ('date'));
    }

    const boxStyle = this.mergeStyles ('box');

    var htmlCalendar = this.getLines ();

    return (
      <div
        disabled={disabled}
        style={boxStyle}
        {...this.props}
      >
        {htmlCalendar}
      </div>
    );
  }
}

/******************************************************************************/
