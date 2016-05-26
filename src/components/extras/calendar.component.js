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
      n = null;
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
  getButtons (first, count, selectedDay) {
    let line = [];
    let i = 0;
    for (i = 0; i < 7; ++i) {
      let n = first + i;
      const key = n;
      if (n > count) {
        n = -1;
      }
      const active = (n > 0 ? (selectedDay === n ? 'true' : 'false') : 'hidden');
      const button = this.getButton (n, key, active);
      line.push (button);
    }
    return line;
  }

  // Return the html for a line of 7 buttons (for a week).
  getLineOfButtons (first, count, selectedDay) {
    const style = this.mergeStyles ('line');
    return (
      <div style={style}>
      {this.getButtons (first, count, selectedDay)}
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

  // Return an array of line, with header then week's lines.
  getColumnOfLines (header, first, count, selectedDay) {
    let column = [];
    column.push (this.getHeader (header));
    let i = 0;
    for (i = 0; i < 6; ++i) {
      const n = first + i * 7;
      if (n > -6 && n <= count) {
        const line = this.getLineOfButtons (n, count, selectedDay);
        column.push (line);
      }
    }
    return column;
  }

  // Retourne all the html content of the calendar.
  getLines () {
    const internalState = this.getInternalState ();
    const selectedDate  = this.read ('date');

    var date = internalState.get ('visibleDate');
    if (!date) {
      date = new Date (Date.now ());
    }

    const year   = date.getFullYear ();
    const month  = date.getMonth ();
    const dotw   = new Date (year, month, 1).getDay ();  // 0..6 (0 = Sunday)
    const first  = -((dotw + 5) % 7);
    const count  = this.daysInMonth (year, month);
    const header = this.getMonthDescription (month) + ' ' + year;  // 'mai 2016' by example

    var selectedDay = -1;
    if (selectedDate.getFullYear () === date.getFullYear () &&
        selectedDate.getMonth ()    === date.getMonth ()) {
      selectedDay = selectedDate.getDate ();
    }

    const style = this.mergeStyles ('column');
    return (
      <div style={style}>
        {this.getColumnOfLines (header, first, count, selectedDay)}
      </div>
    );
  }

  // Called when the '<' button is clicked.
  // Modify internalState.visibleDate.
  prevMonth () {
    const internalState = this.getInternalState ();
    const visibleDate = internalState.get ('visibleDate');
    internalState.set ('visibleDate', new Date (visibleDate.getFullYear (), visibleDate.getMonth () - 1, 1));
  }

  // Called when the '>' button is clicked.
  // Modify internalState.visibleDate.
  nextMonth () {
    const internalState = this.getInternalState ();
    const visibleDate = internalState.get ('visibleDate');
    internalState.set ('visibleDate', new Date (visibleDate.getFullYear (), visibleDate.getMonth () + 1, 1));
  }

  // Called when a [1]..[31] button is clicked.
  setDate (n) {
    const {state} = this.props;
    const internalState = this.getInternalState ();
    const visibleDate = internalState.get ('visibleDate');
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
