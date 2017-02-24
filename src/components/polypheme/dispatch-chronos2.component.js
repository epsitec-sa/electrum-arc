'use strict';

import React from 'react';
import TicketHelpers from './ticket-helpers.js';

import {
  Container,
  Chronos
} from '../../all-components.js';

function TransformMeetingPointToGlyphs (type, meetingPoint, theme) {
  const glyphs = [];
  const direction = TicketHelpers.getDirectionGlyph (theme, type);
  glyphs.push ({Glyph: direction.glyph, Color: direction.color});
  for (let note of meetingPoint.Notes) {
    for (let glyph of note.Glyphs) {
      glyphs.push (glyph);
    }
  }
  return glyphs;
}

function TransformMeetingPointToNote (type, mp, theme) {
  const note = {};
  note.Content = mp.ShortDescription;
  note.Glyphs = TransformMeetingPointToGlyphs (type, mp, theme);
  return note;
}
function TransformTicketToEvent (name, ticket, theme) {
  const event = {};
  const direction = TicketHelpers.getDirectionGlyph (theme, ticket.Type);
  event.Group    = name;
  event.FromTime = ticket.MeetingPoint.StartPlanedTime;
  event.ToDate   = name;
  event.ToTime   = ticket.MeetingPoint.EndPlanedTime;
  event.Note     = TransformMeetingPointToNote (ticket.Type, ticket.MeetingPoint, theme);
  event.Link     = ticket.MissionId;
  event.Color    = direction.color;
  return event;
}

function TransformRoadbookToEvents (events, roadbook, theme) {
  const name = roadbook.Messenger.Name;
  for (var ticket of roadbook.Tickets) {
    const event = TransformTicketToEvent (name, ticket, theme);
    events.Events.push (event);
  }
}

function Transform (data, theme) {
  console.log ('DispatchChronos2.Transform');
  const events = {};
  events.FromDate = '2017-01-01';
  events.ToDate = '2017-12-31';
  events.Events = [];
  for (var roadbook of data.Roadbooks) {
    TransformRoadbookToEvents (events, roadbook, theme);
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
      data = Transform (window.document.dataDispatch, this.props.theme);
    }

    return (
      <Container kind='tickets-root' {...this.link ()} >
        <Chronos
          data       = {data}
          lineWidth  = '250px'
          glyphWidth = '80px'
          {...this.link ()} />
      </Container>
    );
  }
}
