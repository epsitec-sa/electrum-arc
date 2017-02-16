'use strict';

import React from 'react';
import Converters from '../polypheme/converters';

import {
  Container,
  Chronos
} from '../../all-components.js';

function TransformMeetingPointToGlyphs (type, mp) {
  const glyphs = [];
  for (let note of mp.Notes) {
    for (let glyph of note.Glyphs) {
      glyphs.push (glyph);
    }
  }
  return glyphs;
}

function TransformMeetingPointToNote (type, mp) {
  const note = {};
  note.Content = type + ': ' + mp.ShortDescription;
  note.Glyphs = TransformMeetingPointToGlyphs (type, mp);
  return note;
}
function TransformTicketToEvent (name, ticket) {
  const event = {};
  var mp;
  if (ticket.Type.startsWith ('pick')) {
    mp = ticket.Trip.Pick;
  } else {
    mp = ticket.Trip.Drop;
  }
  event.FromDate = name;
  event.FromTime = mp.PlanedTime;
  event.ToDate   = name;
  event.ToTime   = Converters.addMinutes (mp.PlanedTime, Math.random () * 60);
  event.Note = TransformMeetingPointToNote (ticket.Type, mp);
  return event;
}

function TransformRoadbookToEvents (events, roadbook) {
  const name = roadbook.Messenger.Name;
  for (var ticket of roadbook.Tickets) {
    const event = TransformTicketToEvent (name, ticket);
    events.Events.push (event);
  }
}

function Transform (data) {
  console.log ('DispatchChronos2.Transform');
  const events = {};
  events.FromDate = '2017-01-01';
  events.ToDate = '2017-12-31';
  events.Events = [];
  for (var roadbook of data.Roadbooks) {
    TransformRoadbookToEvents (events, roadbook);
  }
  return events;
}

export default class DispatchChronos2 extends React.Component {

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
