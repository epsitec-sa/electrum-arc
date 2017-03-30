'use strict';

import React from 'react';
import {Container, Calendar, Clock, CheckButton, Separator} from 'electrum-arc';

/******************************************************************************/

function getIndex (list, date) {
  let index = 0;
  for (var item of list) {
    if (item.Date === date) {
      return index;
    }
    index++;
  }
  return -1;
}

/******************************************************************************/

export default class Recurrence extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      selectedDateTime: null,
      hasEvent:         false,
    };
  }

  getSelectedDateTime () {
    return this.state.selectedDateTime;
  }

  setSelectedDateTime (value) {
    this.setState ( {
      selectedDateTime: value
    });
  }

  getHasEvent () {
    return this.state.hasEvent;
  }

  setHasEvent (value) {
    this.setState ( {
      hasEvent: value
    });
  }

  calendarSelectDate (dateTime) {
    this.setSelectedDateTime (dateTime);
    this.setHasEvent (dateTime.Type === 'default' || dateTime.Type === 'added');
  }

  eventButtonClicked () {
    const recurrence = this.read ('recurrence');
    const dateTime = this.getSelectedDateTime ();
    if (dateTime.Type === 'default') {
      const item = {
        Date: dateTime.Date,
        Time: '11:30:00',
        Type: 'added',
      };
      recurrence.Delete.push (item);
    } else if (dateTime.Type === 'added') {
      const i = getIndex (recurrence.Add, dateTime.Date);
      recurrence.Add.splice (i, 1);
    } else if (dateTime.Type === 'deleted') {
      const i = getIndex (recurrence.Delete, dateTime.Date);
      recurrence.Delete.splice (i, 1);
    } else if (dateTime.Type === 'none') {
      const item = {
        Date: dateTime.Date,
        Time: '11:30:00',
        Type: 'added',
      };
      recurrence.Add.push (item);
    }
  }

  render () {
    const recurrence = this.read ('recurrence');

    return (
      <Container
        kind = 'row'
        {...this.link ()}>
        <Calendar
          recurrence   = {recurrence}
          mouse-action = {x => this.calendarSelectDate (x)}
          {...this.link ()} />
        <Container
          kind = 'column'
          {...this.link ()}>
          <CheckButton
            text            = 'Événement'
            checked         = {this.getHasEvent () ? 'true' : 'false'}
            custom-on-click = {() => this.eventButtonClicked ()}
            {...this.link ()} />
          <Separator
            height = '15px'
            {...this.link ()} />
          <Clock
            {...this.link ()} />
        </Container>
      </Container>
    );
  }
}

/******************************************************************************/
