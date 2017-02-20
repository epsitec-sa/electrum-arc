'use strict';

import React from 'react';

import {
  Container,
  Chronos
} from '../../all-components.js';

function TransformPickToGlyphs (pick) {
  const glyphs = [];
  for (let note of pick.Notes) {
    for (let glyph of note.Glyphs) {
      glyphs.push (glyph);
    }
  }
  return glyphs;
}

function TransformDropToGlyphs (drop) {
  const glyphs = [];
  for (let note of drop.Notes) {
    for (let glyph of note.Glyphs) {
      glyphs.push (glyph);
    }
  }
  return glyphs;
}

function TransformPickToNote (pick) {
  const note = {};
  note.Content = pick.ShortDescription;
  note.Glyphs = TransformPickToGlyphs (pick);
  return note;
}

function TransformDropToNote (drop) {
  const note = {};
  note.Content = drop.ShortDescription;
  note.Glyphs = TransformDropToGlyphs (drop);
  return note;
}

function TransformTripToNotes (trip) {
  const n1 = TransformPickToNote (trip.Pick);
  const n2 = TransformDropToNote (trip.Drop);
  return [n1, n2];
}

function TransformTicketToEvent (ticket) {
  const event = {};
  event.FromDate = ticket.Trip.Pick.PlanedDate;
  event.StartFromTime = ticket.Trip.Pick.StartPlanedTime;
  event.EndFromTime = ticket.Trip.Pick.EndPlanedTime;
  event.ToDate = ticket.Trip.Drop.PlanedDate;
  event.StartToTime = ticket.Trip.Drop.StartPlanedTime;
  event.EndToTime = ticket.Trip.Drop.EndPlanedTime;
  event.Notes = TransformTripToNotes (ticket.Trip);
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
        <Chronos
          data       = {data}
          lineWidth  = '250px'
          glyphWidth = '60px'
          {...this.link ()} />
      </Container>
    );
  }
}
