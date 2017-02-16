'use strict';

import React from 'react';

import {
  Container,
  Chronos
} from '../../all-components.js';

function TransformTripToGlyphs (trip) {
  const glyphs = [];
  for (let note of trip.Pick.Notes) {
    for (let glyph of note.Glyphs) {
      glyphs.push (glyph);
    }
  }
  for (let note of trip.Drop.Notes) {
    for (let glyph of note.Glyphs) {
      glyphs.push (glyph);
    }
  }
  return glyphs;
}

function TransformTripToNote (trip) {
  const note = {};
  note.Content = trip.Pick.ShortDescription + ' / ' + trip.Drop.ShortDescription;
  note.Glyphs = TransformTripToGlyphs (trip);
  return note;
}
function TransformTicketToEvent (ticket) {
  const event = {};
  event.FromDate = ticket.Trip.Pick.PlanedDate;
  event.FromTime = ticket.Trip.Pick.PlanedTime;
  event.ToDate = ticket.Trip.Drop.PlanedDate;
  event.ToTime = ticket.Trip.Drop.PlanedTime;
  event.Note = TransformTripToNote (ticket.Trip);
  return event;
}

function Transform (data) {
  console.log ('DispatchChronos1.Transform');
  const events = {};
  events.FromDate = '2017-01-01';
  events.ToDate = '2017-12-31';
  events.Events = [];
  for (var ticket of data.Backlog.Tickets) {
    const event = TransformTicketToEvent (ticket);
    events.Events.push (event);
  }
  return events;
}

export default class DispatchChronos1 extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    let data = this.read ('data');
    if (data) {
      data = JSON.parse (data);
    } else {
      data = Transform (window.document.dataDispatch);
    }

    return (
      <Container kind='tickets-root' {...this.link ()} >
        <Chronos data={data} {...this.link ()} />
      </Container>
    );
  }
}
