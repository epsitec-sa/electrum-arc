'use strict';

function transformMeetingPointToGlyphs (meetingPoint) {
  const glyphs = [];
  for (let note of meetingPoint.Notes) {
    for (let glyph of note.Glyphs) {
      glyphs.push (glyph);
    }
  }
  return glyphs;
}

function transformMeetingPointToNote (meetingPoint) {
  const note = {};
  note.Content = meetingPoint.ShortDescription;
  note.Glyphs = transformMeetingPointToGlyphs (meetingPoint);
  return note;
}

function transformPickDropToNotes (pick, drop) {
  const n1 = transformMeetingPointToNote (pick.MeetingPoint);
  const n2 = transformMeetingPointToNote (drop.MeetingPoint);
  return [n1, n2];
}

function transformPickDropToEvent (pick, drop) {
  const event = {};
  event.FromDate      = pick.MeetingPoint.PlanedDate;
  event.StartFromTime = pick.MeetingPoint.StartPlanedTime;
  event.EndFromTime   = pick.MeetingPoint.EndPlanedTime;
  event.ToDate        = drop.MeetingPoint.PlanedDate;
  event.StartToTime   = drop.MeetingPoint.StartPlanedTime;
  event.EndToTime     = drop.MeetingPoint.EndPlanedTime;
  event.Notes         = transformPickDropToNotes (pick, drop);
  event.Link          = pick.MissionId;
  return event;
}

function transformTicketToEvent (ticket) {
  const event = {};
  event.FromDate      = ticket.MeetingPoint.PlanedDate;
  event.ToDate        = ticket.MeetingPoint.PlanedDate;
  event.FromTime      = ticket.MeetingPoint.StartPlanedTime;
  event.ToTime        = ticket.MeetingPoint.EndPlanedTime;
  event.Notes         = [transformMeetingPointToNote (ticket.MeetingPoint)];
  event.Link          = ticket.MissionId;
  return event;
}

function search (backlog, missionId) {
  const result = [];
  for (var ticket of backlog.Tickets) {
    if (ticket.MissionId === missionId) {
      result.push (ticket);
    }
  }
  return result;
}

function transform (data) {
  const events = {};
  events.FromDate = '2017-01-01';
  events.ToDate = '2017-12-31';
  events.Events = [];
  const hash = new Map ();
  for (var ticket of data.Backlog.Tickets) {
    if (!hash.has (ticket.MissionId)) {
      hash.set (ticket.MissionId);
      const s = search (data.Backlog, ticket.MissionId);
      if (s.length === 2) {
        const event = transformPickDropToEvent (s[0], s[1]);
        events.Events.push (event);
      } else {
        for (var t of s) {
          const event = transformTicketToEvent (t);
          events.Events.push (event);
        }
      }
    }
  }
  return events;
}

module.exports = {
  transform,
};
