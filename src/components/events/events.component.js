'use strict';

import React from 'react';
import Enumerable from 'linq';

import {
  Container,
  Ticket,
  Label
} from '../../all-components.js';

/******************************************************************************/

// value =  '1', decimals = 3  -> return '001'
// value =  'a', decimals = 3  -> return null
// value =    5, decimals = 3  -> return '005'
// value =   12, decimals = 3  -> return '012'
// value = 1234, decimals = 3  -> return null
function padding (value, decimals) {
  if (typeof value === 'string') {
    value = parseInt (value);
    if (isNaN (value)) {
      return null;
    }
  }
  const result = value.toLocaleString ('en-US', {minimumIntegerDigits: decimals, useGrouping: false});
  if (result.length > decimals) {
    return null;
  } else {
    return result;
  }
}

function DateToString (date) {
  return padding (date.getFullYear (), 4) + '-' + padding (date.getMonth () + 1, 2) + '-' + padding (date.getDate (), 2);
}

function StringToDate (date) {
  return new Date (date);
}

function nextDay (date) {
  const d = StringToDate (date);
  const nd = new Date (d.getFullYear (), d.getMonth (), d.getDate () + 1);
  return DateToString (nd);
}

/******************************************************************************/

export default class Events extends React.Component {

  constructor (props) {
    super (props);
  }

  getDays (data) {
    const result = new Map ();
    let currentDate = data.FromDate;
    let i = 0;
    while (true) {
      const events = Enumerable.from (data.Events).where (e => e.FromDate === currentDate).select (e => e.Note).toArray ();
      result.set (currentDate, events);
      currentDate = nextDay (currentDate);
      if (currentDate === data.ToDate || i++ > 100) {
        break;
      }
    }
    return result;
  }

  renderContent (event) {
    return (
      <Label text={event.Content} {...this.link ()} />
    );
  }

  renderEvent (event, index) {
    return (
      <Ticket
        key  = {index}
        kind = 'rect'
        {...this.link ()} >
        {this.renderContent (event)}
      </Ticket>
    );
  }

  renderEvents (events) {
    const result = [];
    let index = 0;
    for (var event of events) {
      result.push (this.renderEvent (event, index++));
    }
    return result;
  }

  renderDay (day, index) {
    return (
      <Container
        kind = 'column'
        {...this.link ()} >
        <Label text={day[0]} {...this.link ()} />
        {this.renderEvents (day[1])}
      </Container>
    );
  }

  renderDays (data) {
    const result = [];
    let index = 0;
    const days = this.getDays (data);
    for (var day of days) {
      result.push (this.renderDay (day, index++));
    }
    return result;
  }

  render () {
    const data = this.read ('data');
    return (
      <Container
        kind = 'tickets-messengers'
        {...this.link ()} >
        {this.renderDays (data)}
      </Container>
    );
  }
}

/******************************************************************************/
