import React from 'react';
import {Calendar} from 'electrum-arc';
import Converters from '../polypheme/converters';
import CronParser from 'cron-parser';
import ReducerRecurrence from './reducer-recurrence.js';

/******************************************************************************/

function monthCount () {
  return 2;
}

function pushCron (result, cron, date, deleteList) {
  const year  = Converters.getYear  (date);
  const month = Converters.getMonth (date);
  var options = {
    currentDate: new Date (year, month - 2,             1),
    endDate:     new Date (year, month + monthCount (), 1),
    iterator:    true
  };
  const interval = CronParser.parseExpression (cron, options);
  /* eslint no-constant-condition: 0 */
  while (true) {
    const next = interval.next ();
    if (next.done) {
      break;
    }
    const itemDate = Converters.jsToFormatedDate (next.value);
    const deleted = deleteList.indexOf (itemDate) !== -1;
    const item = {
      Date: itemDate,
      Type: deleted ? 'deleted' : 'default',
    };
    result.push (item);
  }
}

function getRecurrenceItems (recurrence, date) {
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
      recurrenceDates: [],
      dates:           [],
    };
    this.recurrenceData = {};
    const now = Converters.getNowFormatedDate ();
    const year  = Converters.getYear  (now);
    const month = Converters.getMonth (now);
    this.visibleDate = Converters.getDate (year, month, 1);
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
    this.recurrenceData = this.read ('recurrence');
  }

  componentDidMount () {
    this.updateDates ();
  }

  updateDates () {
    const items = getRecurrenceItems (this.recurrenceData, this.visibleDate);
    this.setRecurrenceDates (items);

    const dates = [];
    for (let item of items) {
      if (item.Type === 'default' || item.Type === 'added') {
        dates.push (item.Date);
      }
    }
    this.setDates (dates);
  }

  dateClicked (date) {
    const item = getRecurrenceItem (date, this.getRecurrenceDates ());
    var data = this.recurrenceData;
    if (item.Type === 'default') {
      // If click on recurrent event, add a date into section 'Delete' for canceled the recurrence.
      data = ReducerRecurrence.reducer (data, {type: 'ADD_DELETE', date: item.Date});
    } else if (item.Type === 'added') {
      // If click on added event, simply remove it.
      data = ReducerRecurrence.reducer (data, {type: 'DELETE_ADD', date: item.Date});
    } else if (item.Type === 'deleted') {
      // If click on deleted event, remove 'Delete' entry. That restore the recurrent event.
      data = ReducerRecurrence.reducer (data, {type: 'DELETE_DELETE', date: item.Date});
    } else if (item.Type === 'none') {
      // If click on free date, add a event.
      data = ReducerRecurrence.reducer (data, {type: 'ADD_ADD', date: item.Date});
    }
    this.recurrenceData = data;
    this.updateDates ();
  }

  visibleDateChanged (date) {
    this.visibleDate = date;
    this.updateDates ();
  }

  render () {
    return (
      <Calendar
        month-count          = {monthCount ()}
        visible-date         = {this.visibleDate}
        dates                = {this.getDates ()}
        date-clicked         = {x => this.dateClicked (x)}
        visible-date-changed = {x => this.visibleDateChanged (x)}
        {...this.link ()} />
    );
  }
}

/******************************************************************************/
