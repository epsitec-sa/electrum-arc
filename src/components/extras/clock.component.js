'use strict';

import React from 'react';
import {Action} from 'electrum';
import {Button} from 'electrum-arc';

/******************************************************************************/

export default class Clock extends React.Component {

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

  // If the input date is undefine, set to now.
  // If the input date is a number, cast to Date.
  normalizeTime (date) {
    if (date) {
      return new Date (date);
    } else {
      var now = new Date (Date.now ());
      return new Date (0, 0, 0, now.getHours (), now.getMinutes ());
    }
  }

  // Return the html for the header.
  getHeader (header) {
    const style     = this.mergeStyles ('header');
    const textStyle = this.mergeStyles ('headerText');
    return (
      <div style={style}>
        <div style={textStyle}>
          {header}
        </div>
      </div>
    );
  }

  // Return the html for a [0]..[23] button.
  getHoursButton (n, active) {
    return (
      <Button
        key     = {'H' + n}
        text    = {n}
        kind    = 'calendar'
        active  = {active}
        spacing = 'overlap'
        action  = {() => this.setHours (n)}
        {...this.link ()}
      />
    );
  }

  // Return the html for a [0]..[59] button.
  getMinutesButton (n, active) {
    return (
      <Button
        key     = {'M' + n}
        text    = {n}
        kind    = 'calendar'
        active  = {active}
        spacing = 'overlap'
        action  = {() => this.setMinutes (n)}
        {...this.link ()}
      />
    );
  }

  // Return an array of buttons.
  getHoursButtons (first, last, selectedHours) {
    let line = [];
    let n = 0;
    for (n = first; n <= last; n++) {
      const active = selectedHours === n ? 'true' : 'false';
      const button = this.getHoursButton (n, active);
      line.push (button);
    }
    return line;
  }

  // Return an array of buttons.
  getMinutesButtons (first, last, step, selectedMinutes) {
    let line = [];
    let n = 0;
    for (n = first; n <= last; n += step) {
      const active = selectedMinutes === n ? 'true' : 'false';
      const button = this.getMinutesButton (n, active);
      line.push (button);
    }
    return line;
  }

  // Return the html for a line of buttons.
  getLineOfHoursButtons (first, last, selectedHours) {
    const style = this.mergeStyles ('line');
    return (
      <div style={style}>
        {this.getHoursButtons (first, last, selectedHours)}
      </div>
    );
  }

  // Return the html for a line of buttons.
  getLineOfMinutesButtons (first, last, step, selectedminutes) {
    const style = this.mergeStyles ('line');
    return (
      <div style={style}>
        {this.getMinutesButtons (first, last, step, selectedminutes)}
      </div>
    );
  }

  // Return an array of line.
  getColumnOfLines (selectedHours, selectedMinutes) {
    let column = [];
    column.push (this.getHeader               ('Heure'));
    column.push (this.getLineOfHoursButtons   ( 6, 11,    selectedHours));
    column.push (this.getLineOfHoursButtons   (12, 17,    selectedHours));
    column.push (this.getLineOfHoursButtons   (18, 23,    selectedHours));
    column.push (this.getHeader               ('Minutes'));
    column.push (this.getLineOfMinutesButtons ( 0, 25, 5, selectedMinutes));
    column.push (this.getLineOfMinutesButtons (30, 55, 5, selectedMinutes));
    return column;
  }

  // Retourne all the html content of the clock.
  getLines () {
    const time = this.normalizeTime (this.read ('time'));
    const selectedHours   = time.getHours ();
    const selectedMinutes = time.getMinutes ();

    const style = this.mergeStyles ('column');
    return (
      <div style={style}>
        {this.getColumnOfLines (selectedHours, selectedMinutes)}
      </div>
    );
  }

  // Called when a [0]..[23] button is clicked.
  setHours (hours) {
    const {state} = this.props;
    const time = this.normalizeTime (this.read ('time'));
    const newTime = new Date (0, 0, 0, hours, time.getMinutes ());
    state.set ('time', newTime);

    if (this.props.onChange) {
      this.props.onChange (newTime);
    }
  }

  // Called when a [0]..[59] button is clicked.
  setMinutes (minutes) {
    const {state} = this.props;
    const time = this.normalizeTime (this.read ('time'));
    const newTime = new Date (0, 0, 0, time.getHours (), minutes);
    state.set ('time', newTime);

    if (this.props.onChange) {
      this.props.onChange (newTime);
    }
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);

    const boxStyle = this.mergeStyles ('box');

    var htmlClock = this.getLines ();

    return (
      <div
        disabled={disabled}
        style={boxStyle}
        {...this.props}
      >
        {htmlClock}
      </div>
    );
  }
}

/******************************************************************************/
