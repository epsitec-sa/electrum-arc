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
      width:   this.read ('width'),
      height:  this.read ('height'),
      kind:    this.read ('kind'),
      spacing: this.read ('spacing'),
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

  // Return the internalState with contain the visibleDate.
  // internalState.visibleDate fix the visible year and month.
  getInternalState () {
    const {state} = this.props;
    return state.select ('calendar-internal');
  }

  // Return the html for a [1]..[31] button.
  getButton (firstDate, active, nature, index) {
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
  getButtons (firstDate, visibleDate, selectedDate) {
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
          firstDate.getDate     () === selectedDate.getDate    ()) {
        active = 'true';
      }
      const nature = (i < 5) ? 'default' : 'weekend';
      const button = this.getButton (firstDate, active, nature, i);
      line.push (button);
      firstDate = new Date (firstDate.getFullYear (), firstDate.getMonth (), firstDate.getDate () + 1);
    }
    return line;
  }

  // Return the html for a line of 7 buttons (for a week).
  getLineOfButtons (firstDate, visibleDate, selectedDate, index) {
    const style = this.mergeStyles ('line');
    return (
      <div style={style} key={index}>
        {this.getButtons (firstDate, visibleDate, selectedDate)}
      </div>
    );
  }

  // Return the html for the header, with 2 buttons next/prevMonth and the title.
  // By example: '<' mai 2016 '>'
  getHeader (header) {
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
  getDOW (text, index) {
    const textStyle = this.mergeStyles ('dowText');
    return (
      <div style={textStyle} key={index}>
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
      const x = this.getDOW (dow, i);
      line.push (x);
    }
    return line;
  }

  // Return the html for the 7 days of week header.
  getLineOfDOWs () {
    const style = this.mergeStyles ('dowLine');
    return (
      <div style={style} key='dows'>
        {this.getDOWs ()}
      </div>
    );
  }

  // Return an array of lines, with header then week's lines.
  // The array must have from 4 to 6 lines.
  getColumnOfLines (header, firstDate, visibleDate, selectedDate) {
    let column = [];
    column.push (this.getHeader (header));
    column.push (this.getLineOfDOWs ());
    let i = 0;
    for (i = 0; i < 6; ++i) {
      const line = this.getLineOfButtons (firstDate, visibleDate, selectedDate, i);
      column.push (line);
      firstDate = new Date (firstDate.getFullYear (), firstDate.getMonth (), firstDate.getDate () + 7);
    }
    return column;
  }

  // Retourne all the html content of the calendar.
  getLines () {
    const internalState = this.getInternalState ();
    const visibleDate   = this.normalizeDate (internalState.get ('visibleDate'));
    const selectedDate  = this.normalizeDate (this.read ('date'));
    const visibleYear   = visibleDate.getFullYear ();  // 2016
    const visibleMonth  = visibleDate.getMonth ();  // 0..11
    const dotw          = new Date (visibleYear, visibleMonth, 1).getDay ();  // 0..6 (0 = Sunday)
    const first         = -((dotw + 5) % 7);
    const firstDate     = new Date (visibleYear, visibleMonth, first);
    const header        = this.getMonthDescription (visibleMonth) + ' ' + visibleYear;  // 'mai 2016' by example

    const style = this.mergeStyles ('column');
    return (
      <div style={style}>
        {this.getColumnOfLines (header, firstDate, visibleDate, selectedDate)}
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
  setDate (date) {
    const {state} = this.props;
    state.set ('date', date);

    if (this.props.onChange) {
      this.props.onChange (date);
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
      >
        {htmlCalendar}
      </div>
    );
  }
}

/******************************************************************************/
