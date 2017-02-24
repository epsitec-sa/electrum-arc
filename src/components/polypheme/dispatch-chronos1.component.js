'use strict';

import React from 'react';

import {
  Container,
  Chronos
} from '../../all-components.js';

function TransformmeetingPointToGlyphs (meetingPoint) {
  const glyphs = [];
  for (let note of meetingPoint.Notes) {
    for (let glyph of note.Glyphs) {
      glyphs.push (glyph);
    }
  }
  return glyphs;
}

function TransformMeetingPointToNote (meetingPoint) {
  const note = {};
  note.Content = meetingPoint.ShortDescription;
  note.Glyphs = TransformmeetingPointToGlyphs (meetingPoint);
  return note;
}

function TransformTripToNotes (pick, drop) {
  const n1 = TransformMeetingPointToNote (pick.MeetingPoint);
  const n2 = TransformMeetingPointToNote (drop.MeetingPoint);
  return [n1, n2];
}

function TransformTicketToEvent (pick, drop) {
  const event = {};
  event.FromDate      = pick.MeetingPoint.PlanedDate;
  event.StartFromTime = pick.MeetingPoint.StartPlanedTime;
  event.EndFromTime   = pick.MeetingPoint.EndPlanedTime;
  event.ToDate        = drop.MeetingPoint.PlanedDate;
  event.StartToTime   = drop.MeetingPoint.StartPlanedTime;
  event.EndToTime     = drop.MeetingPoint.EndPlanedTime;
  event.Notes = TransformTripToNotes (pick, drop);
  return event;
}

function Search (backlog, missionId) {
  const result = [];
  for (var ticket of backlog.Tickets) {
    if (ticket.MissionId === missionId) {
      result.push (ticket);
    }
  }
  return result;
}

function Transform (data) {
  console.log ('DispatchChronos1.Transform');
  const events = {};
  events.FromDate = '2017-01-01';
  events.ToDate = '2017-12-31';
  events.Events = [];
  const hash = new Map ();
  for (var ticket of data.Backlog.Tickets) {
    if (!hash.has (ticket.MissionId)) {
      hash.set (ticket.MissionId);
      const s = Search (data.Backlog, ticket.MissionId);
      if (s.length === 2) {
        const event = TransformTicketToEvent (s[0], s[1]);
        events.Events.push (event);
      }
    }
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
