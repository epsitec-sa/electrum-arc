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
    const x = [
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
    return x[month - 1];
  }

  getButton (n, active) {
    if (n <= 0) {
      n = null;
    }
    return (
      <Button
        text    = {n}
        kind    = 'calendar'
        active  = {active}
        spacing = 'overlap'
        {...this.link ()}
      />
    );
  }

  getButtons (first, count) {
    let line = [];
    let i = 0;
    for (i = 0; i < 7; ++i) {
      let n = first + i;
      if (n > count) {
        n = -1;
      }
      const active = (n > 0 ? 'false' : 'hidden');
      const button = this.getButton (n, active);
      line.push (button);
    }
    return line;
  }

  getLineOfButtons (first, count) {
    const style = this.mergeStyles ('line');
    return (
      <div style={style}>
      {this.getButtons (first, count)}
      </div>
    );
  }

  getHeader (header) {
    const style = this.mergeStyles ('header');
    return (
      <div style={style}>
      {header}
      </div>
    );
  }

  getColumnOfLines (header, first, count) {
    let column = [];
    column.push (this.getHeader (header));
    let i = 0;
    for (i = 0; i < 6; ++i) {
      const line = this.getLineOfButtons (first + i * 7, count);
      column.push (line);
    }
    return column;
  }

  getLines (date) {
    date = new Date (date);  // the date recevied is a number !
    // const year  = date.year;
    // const month = date.month;
    // const dotw  = new Date (year, month, 1).day;  // 0..6 (0 = Sunday)
    const year  = 2016;
    const month = 5;
    const dotw  = 0;
    const first = -((dotw + 5) % 7);
    const count = 31;
    const header = this.getMonthDescription (month) + ' ' + year;
    const style = this.mergeStyles ('column');
    return (
      <div style={style}>
      {this.getColumnOfLines (header, first, count)}
      </div>
    );
  }

  render () {
    const {state} = this.props;
    const disabled = Action.isDisabled (state);
    let   inputDate = this.read ('date');

    if (!inputDate) {
      inputDate = Date.now ();
    }

    const boxStyle = this.mergeStyles ('box');

    var htmlCalendar = this.getLines (inputDate);

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
