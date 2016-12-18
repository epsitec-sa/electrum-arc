'use strict';

import reducerTickets from './reducer-tickets.js';

function searchTicket (root, items, type, id, ownerId) {
  if (id) {
    for (var i = 0, len = items.length; i < len; i++) {
      const ticket = items[i];
      if (ticket.id === id) {
        return {
          ownerId: root.id,
          type:    type,
          tickets: items,
          ticket:  ticket,
          index:   i,
        };
      }
    }
  } else if (root.id === ownerId) {
    const length = items.length;
    const ticket = (length === 0) ? null : items[length - 1];
    return {
      ownerId: root.id,
      type:    type,
      tickets: items,
      ticket:  ticket,
      index:   items.length,
    };
  }
  return null;
}

function searchId (state, id, ownerId) {
  const m = searchTicket (state, state.Roadbooks, 'messengers', id, ownerId);
  if (m) {
    return m;
  }
  const r = searchTicket (state.Backlog, state.Backlog.Tickets, 'backlog', id, ownerId);
  if (r) {
    return r;
  }
  for (var roadbook of state.Roadbooks) {
    const result = searchTicket (roadbook, roadbook.Tickets, 'roadbooks', id, ownerId);
    if (result) {
      return result;
    }
  }
  for (var tray of state.Desk) {
    const result = searchTicket (tray, tray.Tickets, 'desk', id, ownerId);
    if (result) {
      return result;
    }
  }
  throw new Error (`Id not found for ${id}`);
}

function getRoadbookTickets (state, roadbookId) {
  for (var readbook of state.Roadbooks) {
    if (readbook.id === roadbookId) {
      return readbook.Tickets;
    }
  }
  throw new Error (`Roadbook ${roadbookId} does not exist`);
}

function addTicket (tickets, index, ticket) {
  tickets = reducerTickets (tickets, {
    type:   'ADD_TICKET',
    index:  index,
    ticket: ticket,
  });
}

function deleteTicket (tickets, ticket) {
  tickets = reducerTickets (tickets, {
    type:   'DELETE_TICKET',
    ticket: ticket,
  });
}

function getTicketsFromMissionId (tickets, missionId) {
  const result = [];
  for (var ticket of tickets) {
    if (ticket.Trip.MissionId === missionId) {
      result.push (ticket);
    }
  }
  return result;
}

// Return a new random guid.
// See http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function getNewId () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace (/[xy]/g, function (c) {
      var r = Math.random () * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString (16);
    });
}

// Return a deep copy of ticket, with new ids.
function clone (ticket) {
  const n = JSON.parse (JSON.stringify (ticket));
  n.id = getNewId ();
  n.Trip.id = getNewId ();
  n.Trip.Pick.id = getNewId ();
  n.Trip.Drop.id = getNewId ();
  return n;
}

// Search all tickets into Roadbooks and Desk.
function isTicketIntoTray (state, missionId) {
  for (var tray of state.Desk) {
    for (var ticket2 of tray.Tickets) {
      if (ticket2.Trip.MissionId === missionId) {
        return true;
      }
    }
  }
  return false;
}

// Return new ticket for transit. If it's a pick, create a drop zone for transit, and reverse.
function getNewTransit (ticket) {
  const n = clone (ticket);
  if (n.Type.startsWith ('pick')) {
    n.Type = 'drop-transit';
    n.Trip.Drop.LongDescription = null;
    n.Trip.Drop.Notes = [];
    n.Trip.Drop.PlanedTime = ticket.Trip.Pick.PlanedTime;
    n.Trip.Drop.ShortDescription = 'Inconnu';
    n.Trip.Drop.Zone = null;
  } else if (n.Type.startsWith ('drop')) {
    n.Type = 'pick-transit';
    n.Trip.Pick.LongDescription = null;
    n.Trip.Pick.Notes = [];
    n.Trip.Pick.PlanedTime = ticket.Trip.Drop.PlanedTime;
    n.Trip.Pick.ShortDescription = 'Inconnu';
    n.Trip.Pick.Zone = null;
  }
  n.Flash = 'true';
  return n;
}

// Create a transit if a ticket is alone for a roadbook.
function createTransit (state, warnings, roadbookId) {
  const tickets = getRoadbookTickets (state, roadbookId);
  for (var ticket of tickets) {
    const same = getTicketsFromMissionId (tickets, ticket.Trip.MissionId);
    if (same.length === 1 && !isTicketIntoTray (state, ticket.Trip.MissionId)) {
      const newTicket = getNewTransit (ticket);
      const index = tickets.indexOf (ticket);
      if (newTicket.Type.startsWith ('pick')) {
        addTicket (tickets, index, newTicket);
      } else {
        addTicket (tickets, index + 1, newTicket);
      }
      warnings.push ({id: newTicket.id, text: 'Transit à définir'});
    }
  }
}

function createTransits (state, warnings) {
  for (var readbook of state.Roadbooks) {
    createTransit (state, warnings, readbook.id);
  }
}

// Delete if there are unnecessary transits for a roadbook.
// By example, if a transit is alone, it's unnecessary.
// If there are 3 tickets, including 2 unnecessary, delete the 2 unnecessary tickets.
function deleteTransit (state, warnings, roadbookId) {
  const tickets = getRoadbookTickets (state, roadbookId);
  for (var ticket of tickets) {
    const same = getTicketsFromMissionId (tickets, ticket.Trip.MissionId);
    if (same.length > 0 && same.length % 2 === 1) {  // odd number of tickets ?
      for (let i = 0; i < same.length; i++) {
        if (same[i].Type.endsWith ('-transit')) {
          deleteTicket (tickets, same[i]);
        }
      }
    }
  }
}

function deleteTransits (state, warnings) {
  for (var readbook of state.Roadbooks) {
    deleteTransit (state, warnings, readbook.id);
  }
}

// ------------------------------------------------------------------------------------------

// Check if un pick is under a drop, and set the field 'warning'.
function checkOrder (list, warnings) {
  for (let i = 0; i < list.Tickets.length; i++) {
    const ticket = list.Tickets[i];
    const same = getTicketsFromMissionId (list.Tickets, ticket.Trip.MissionId);
    if (same.length === 2 && same[0].Type.startsWith ('drop') && same[1].Type.startsWith ('pick')) {
      warnings.push ({id: same[0].id, text: 'Drop avant pick'});
      warnings.push ({id: same[1].id, text: 'Pick après drop'});
    }
  }
}

// Check if picks are under drops into all Roadbooks.
function checkOrders (state, warnings) {
  for (var readbook of state.Roadbooks) {
    checkOrder (readbook, warnings);
  }
  for (var tray of state.Desk) {
    checkOrder (tray, warnings);
  }
}

// ------------------------------------------------------------------------------------------

function checkAlone (state, warnings, roadbookId) {
  const tickets = getRoadbookTickets (state, roadbookId);
  for (var ticket of tickets) {
    const same = getTicketsFromMissionId (tickets, ticket.Trip.MissionId);
    if (same.length === 1) {
      let text;
      if (ticket.Type.startsWith ('pick')) {
        text = 'Il manque le drop';
      } else if (ticket.Type.startsWith ('drop')) {
        text = 'Il manque le pick';
      } else {
        text = `Incorrect type = ${ticket.Type}`;
      }
      warnings.push ({id: ticket.id, text: text});
    }
  }
}

// Add a warning to all tickets into Roadbooks we are alone.
function checkAlones (state, warnings) {
  for (var readbook of state.Roadbooks) {
    checkAlone (state, warnings, readbook.id);
  }
}

// ------------------------------------------------------------------------------------------

function updateShape (list) {
  for (let i = 0; i < list.Tickets.length; i++) {
    const ticket = list.Tickets[i];
    let shape = 'normal';
    if (i < list.Tickets.length - 1) {
      const other = list.Tickets[i + 1];
      if (ticket.Trip.MissionId === other.Trip.MissionId &&
        ticket.Type.startsWith ('pick') &&
        other.Type.startsWith ('drop')) {  // pick following by drop ?
        shape = 'first';
      }
    }
    if (i > 0) {
      const other = list.Tickets[i - 1];
      if (ticket.Trip.MissionId === other.Trip.MissionId &&
        ticket.Type.startsWith ('drop') &&
        other.Type.startsWith ('pick')) {  // drop preceded by pick ?
        shape = 'last';
      }
    }
    if (ticket.Shape !== shape) {  // changing ?
      ticket.Shape = shape;
      list.Tickets[i] = clone (ticket);
    }
  }
}

// Update shapes to all tickets into Roadbooks and Desk, for showing pick directly following by drop.
function updateShapes (state) {
  for (var readbook of state.Roadbooks) {
    updateShape (readbook);
  }
  for (var tray of state.Desk) {
    updateShape (tray);
  }
}

// ------------------------------------------------------------------------------------------

function getTextWarning (warnings, id) {
  for (var warning of warnings) {
    if (warning.id === id) {
      return warning.text;
    }
  }
  return null;
}

function setWarning (list, warnings) {
  for (let i = 0; i < list.Tickets.length; i++) {
    const ticket = list.Tickets[i];
    const text = getTextWarning (warnings, ticket.id);
    if (ticket.Warning !== text) {  // changing ?
      ticket.Warning = text;  // set or clear warning message
      list.Tickets[i] = clone (ticket);  // Trick necessary for update UI !!!
    }
  }
}

// Set warnings to all ticket into Roadbooks and Desk.
function setWarnings (state, warnings) {
  for (var readbook of state.Roadbooks) {
    setWarning (readbook, warnings);
  }
  for (var tray of state.Desk) {
    setWarning (tray, warnings);
  }
}

// ------------------------------------------------------------------------------------------

function setListFlash (list, ids) {
  for (let i = 0; i < list.Tickets.length; i++) {
    const ticket = list.Tickets[i];
    if (ids.indexOf (ticket.id) !== -1) {
      if (ticket.Flash !== 'true') {  // changing ?
        ticket.Flash = 'true';
        list.Tickets[i] = clone (ticket);  // Trick necessary for update UI !!!
      }
    } else {
      if (ticket.Flash === 'true') {  // changing ?
        ticket.Flash = 'false';
        list.Tickets[i] = clone (ticket);  // Trick necessary for update UI !!!
      }
    }
  }
}

// Set flash mode to all modified tickets.
// Note: Currently, flash mode is permanent. Eventually, it should only appear temporarily
// and disappear gradually.
function setFlash (state, ids) {
  for (var readbook of state.Roadbooks) {
    setListFlash (readbook, ids);
  }
  for (var tray of state.Desk) {
    setListFlash (tray, ids);
  }
  setListFlash (state.Backlog, ids);
}

// ------------------------------------------------------------------------------------------

// Delete all residual tickets into Roadbooks and Desk.
function deleteMission (state, missionId) {
  for (var roadbook of state.Roadbooks) {
    const array1 = [];
    for (var ticket1 of roadbook.Tickets) {
      if (ticket1.Trip.MissionId === missionId) {
        array1.push (ticket1);
      }
    }
    for (ticket1 of array1) {
      deleteTicket (roadbook.Tickets, ticket1);
    }
  }
  for (var tray of state.Desk) {
    const array2 = [];
    for (var ticket2 of tray.Tickets) {
      if (ticket2.Trip.MissionId === missionId) {
        array2.push (ticket2);
      }
    }
    for (ticket2 of array2) {
      deleteTicket (tray.Tickets, ticket2);
    }
  }
}

function changeGeneric (state, warnings, from, to) {
  const ticket = from.ticket;
  if ((to.type === 'backlog' || to.type === 'desk') && ticket.Type.endsWith ('-transit')) {
    // Transit ticket does not move into backlog or desk.
    return;
  }

  // Delete the source.
  if (to.type === 'backlog' && ticket.Type !== 'both') {
    deleteMission (state, ticket.Trip.MissionId);
  } else {
    deleteTicket (from.tickets, ticket);
    if (from.type === to.type && from.index < to.index) {
      to.index--;  // decrease to take account of the deleted item
    }
  }

  // Set the destination.
  ticket.OwnerId = to.ownerId;
  if ((to.type === 'roadbooks' || to.type === 'desk') && ticket.Type === 'both') {
    const pick = clone (ticket);
    const drop = clone (ticket);
    pick.Type = 'pick';
    drop.Type = 'drop';
    addTicket (to.tickets, to.index, drop);  // first drop, for have pick/drop in this order
    addTicket (to.tickets, to.index, pick);
    setFlash (state, [pick.id, drop.id]);
  } else if (to.type === 'backlog' && ticket.Type !== 'both') {
    ticket.Type = 'both';
    ticket.Status = 'pre-dispatched';
    addTicket (to.tickets, to.index, ticket);
    setFlash (state, [ticket.id]);
  } else {
    addTicket (to.tickets, to.index, ticket);
    setFlash (state, [ticket.id]);
  }
}

// ------------------------------------------------------------------------------------------

function drop (state, fromId, toId, toOwnerId) {
  console.log ('Reducer.drop');
  const from = searchId (state, fromId);
  const to   = searchId (state, toId, toOwnerId);
  const warnings = [];
  changeGeneric (state, warnings, from, to);
  if (to.type === 'roadbooks') {
    deleteTransits (state, warnings);
    createTransits (state, warnings);
  }
  checkOrders (state, warnings);
  checkAlones (state, warnings);
  setWarnings (state, warnings);
  updateShapes (state);
  return state;
}

function isUseful (state, fromId, toId, toOwnerId) {
  const from = searchId (state, fromId);
  const to   = searchId (state, toId, toOwnerId);
  if (from.type === to.type) {
    state.isUseful = from.index !== to.index && from.index + 1 !== to.index;
  } else {
    state.isUseful = true;
  }
  return state;
}

// This trick is necessary for update the UI !!!
function cloneAll (state) {
  for (var readbook of state.Roadbooks) {
    for (let i = 0; i < readbook.Tickets.length; i++) {
      const ticket = readbook.Tickets[i];
      readbook.Tickets[i] = clone (ticket);
    }
  }
  return state;
}

function swapSelected (state, id) {
  const search = searchId (state, id);
  search.tickets[search.index].Selected = (search.tickets[search.index].Selected === 'true') ? 'false' : 'true';
  setFlash (state, []);
  return state;
}

function swapExtended (state, id) {
  const search = searchId (state, id);
  search.tickets[search.index].Extended = (search.tickets[search.index].Extended === 'true') ? 'false' : 'true';
  setFlash (state, []);
  return state;
}

function swapStatus (state, id) {
  const search = searchId (state, id);
  if (search.tickets[search.index].Status === 'dispatched') {
    search.tickets[search.index].Status = 'pre-dispatched';
  } else {
    search.tickets[search.index].Status = 'dispatched';
  }
  setFlash (state, []);
  return state;
}

// ------------------------------------------------------------------------------------------

export default function Reducer (state = {}, action = {}) {
  switch (action.type) {
    case 'DROP':
      state = drop (state, action.fromId, action.toId, action.toOwnerId);
      break;
    case 'IS_USEFUL':
      state = isUseful (state, action.fromId, action.toId, action.toOwnerId);
      break;
    case 'CLONE':
      state = cloneAll (state);
      break;
    case 'SWAP_SELECTED':
      state = swapSelected (state, action.id);
      break;
    case 'SWAP_EXTENDED':
      state = swapExtended (state, action.id);
      break;
    case 'SWAP_STATUS':
      state = swapStatus (state, action.id);
      break;
  }
  return state;
}
