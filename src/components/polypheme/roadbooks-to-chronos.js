'use strict';

import TicketHelpers from './ticket-helpers.js';

function transformMeetingPointToGlyphs (type, meetingPoint, theme) {
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

function transformMeetingPointToNote (type, mp, theme) {
  const note = {};
  note.Content = mp.ShortDescription;
  note.Glyphs = transformMeetingPointToGlyphs (type, mp, theme);
  return note;
}

function transformTicketToEvent (name, ticket, theme) {
  const event = {};
  const direction = TicketHelpers.getDirectionGlyph (theme, ticket.Type);
  event.Group    = name;
  event.FromTime = ticket.MeetingPoint.StartPlanedTime;
  event.ToDate   = name;
  event.ToTime   = ticket.MeetingPoint.EndPlanedTime;
  event.Note     = transformMeetingPointToNote (ticket.Type, ticket.MeetingPoint, theme);
  event.Link     = ticket.MissionId;
  event.Color    = direction.color;
  return event;
}

function transformRoadbookToEvents (events, roadbook, theme) {
  const name = roadbook.Messenger.Name;
  for (var ticket of roadbook.Tickets) {
    const event = transformTicketToEvent (name, ticket, theme);
    events.Events.push (event);
  }
}

function transform (roadbooks, theme) {
  const events = {};
  events.FromDate = '2017-01-01';
  events.ToDate = '2017-12-31';
  events.Events = [];
  for (var roadbook of roadbooks) {
    transformRoadbookToEvents (events, roadbook, theme);
  }
  return events;
}

module.exports = {
  transform,
};
