'use strict';

import React from 'react';
import {Calendar} from 'electrum-arc';
import Converters from '../polypheme/converters';
import CronParser from 'cron-parser';
import ReducerRecurrence from './reducer-recurrence.js';

/******************************************************************************/

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
    const deleted = deleteList.indexOf (date) !== -1;
    const item = {
      Date: date,
      Type: deleted ? 'deleted' : 'default',
    };
    result.push (item);
  }
}

function getRecurrenceList (recurrence, date) {
  const result = [];
  if (recurrence) {
    pushCron (result, recurrence.Cron, date, recurrence.Delete);

    for (var a of recurrence.Add) {
      const item = {
        Date: a,
        Type: 'added',
      };
      result.push (item);
    }
  }
  return result;
}

function getRecurrenceItem (date, recurrenceList) {
  for (var item of recurrenceList) {
    if (item.Date === date) {
      return item;
    }
  }
  return {
    Date: date,
    Type: 'none',
  };
}

/******************************************************************************/

export default class Recurrence extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      recurrence:      null,
      recurrenceDates: [],
      dates:           [],
    };
    this.visibleDate = null;
  }

  getRecurrence () {
    return this.state.recurrence;
  }

  setRecurrence (value) {
    this.setState ( {
      recurrence: value
    });
  }

  getRecurrenceDates () {
    return this.state.recurrenceDates;
  }

  setRecurrenceDates (value) {
    this.setState ( {
      recurrenceDates: value
    });
  }

  getDates () {
    return this.state.dates;
  }

  setDates (value) {
    this.setState ( {
      dates: value
    });
  }

  componentWillMount () {
    const recurrence = this.read ('recurrence');
    this.setRecurrence (recurrence);

    const now = Converters.getNowFormatedDate ();
    const year  = Converters.getYear  (now);
    const month = Converters.getMonth (now);
    this.visibleDate = Converters.getDate (year, month, 1);

    this.updateDates ();
  }

  updateDates () {
    const items = getRecurrenceList (this.getRecurrence (), this.visibleDate);
    this.setRecurrenceDates (items);

    const dates = [];
    for (let item of items) {
      if (item.Type === 'default' || item.Type === 'added') {
        dates.push (item.Date);
      }
    }
    this.setDates (dates);

    this.forceUpdate ();
  }

  dateClicked (date) {
    const item = getRecurrenceItem (date, this.getRecurrenceDates ());
    var recurrence = this.getRecurrence ();
    if (item.Type === 'default') {
      // If click on recurrent event, add a date into section 'Delete' for canceled the recurrence.
      recurrence = ReducerRecurrence.reducer (recurrence, {type: 'ADD_DELETE', date: item.Date});
    } else if (item.Type === 'added') {
      // If click on added event, simply remove it.
      recurrence = ReducerRecurrence.reducer (recurrence, {type: 'DELETE_ADD', date: item.Date});
    } else if (item.Type === 'deleted') {
      // If click on deleted event, remove 'Delete' entry. That restore the recurrent event.
      recurrence = ReducerRecurrence.reducer (recurrence, {type: 'DELETE_DELETE', date: item.Date});
    } else if (item.Type === 'none') {
      // If click on free date, add a event.
      recurrence = ReducerRecurrence.reducer (recurrence, {type: 'ADD_ADD', date: item.Date});
    }
    this.setRecurrence (recurrence);
    this.updateDates ();
  }

  visibleDateChanged (date) {
    this.visibleDate = date;
    this.updateDates ();
  }

  render () {
    return (
      <Calendar
        visible-date         = {this.visibleDate}
        dates                = {this.getDates ()}
        date-clicked         = {x => this.dateClicked (x)}
        visible-date-changed = {x => this.visibleDateChanged (x)}
        {...this.link ()} />
    );
  }
}

/******************************************************************************/
