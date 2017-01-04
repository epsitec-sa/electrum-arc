'use strict';

import reducerTickets from './reducer-tickets.js';

// ------------------------------------------------------------------------------------------

function isSelected (state, id) {
  if (!state.Selections) {
    state.Selections = [];
  }
  return state.Selections.indexOf (id) !== -1;
}

function putSelected (state, id, value) {
  const i = state.Selections.indexOf (id);
  if (i === -1 && value) {
    state.Selections.push (id);
  }
  if (i !== -1 && !value) {
    state.Selections.splice (i, 1);
  }
  return state;
}

function setSelected (state, id) {
  const i = state.Selections.indexOf (id);
  if (i === -1) {
    state.Selections.push (id);
  }
  return state;
}

function clearSelected (state, id) {
  const i = state.Selections.indexOf (id);
  if (i !== -1) {
    state.Selections.splice (i, 1);
  }
  return state;
}

// ------------------------------------------------------------------------------------------

function isExtended (state, id) {
  if (!state.Extendeds) {
    state.Extendeds = [];
  }
  return state.Extendeds.indexOf (id) !== -1;
}

function putExtended (state, id, value) {
  const i = state.Extendeds.indexOf (id);
  if (i === -1 && value) {
    state.Extendeds.push (id);
  }
  if (i !== -1 && !value) {
    state.Extendeds.splice (i, 1);
  }
  return state;
}

function setExtended (state, id) {
  const i = state.Extendeds.indexOf (id);
  if (i === -1) {
    state.Extendeds.push (id);
  }
  return state;
}

function clearExtended (state, id) {
  const i = state.Extendeds.indexOf (id);
  if (i !== -1) {
    state.Extendeds.splice (i, 1);
  }
  return state;
}

// ------------------------------------------------------------------------------------------

function isFlash (state, id) {
  if (!state.Flashes) {
    state.Flashes = [];
  }
  return state.Flashes.indexOf (id) !== -1;
}

function putFlash (state, id, value) {
  const i = state.Flashes.indexOf (id);
  if (i === -1 && value) {
    state.Flashes.push (id);
  }
  if (i !== -1 && !value) {
    state.Flashes.splice (i, 1);
  }
  return state;
}

function setFlash (state, id) {
  const i = state.Flashes.indexOf (id);
  if (i === -1) {
    state.Flashes.push (id);
  }
  return state;
}

function clearFlash (state, id) {
  const i = state.Flashes.indexOf (id);
  if (i !== -1) {
    state.Flashes.splice (i, 1);
  }
  return state;
}

// ------------------------------------------------------------------------------------------

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
    // If id is undefined, destination is after the last element.
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
  const r = searchTicket (state.Backlog, state.Backlog.Tickets, 'backlog', id, ownerId);
  if (r) {
    return r;
  }
  const m = searchTicket (state, state.Roadbooks, 'roadbooks', id, ownerId);
  if (m) {
    return m;
  }
  for (var roadbook of state.Roadbooks) {
    const result = searchTicket (roadbook, roadbook.Tickets, 'roadbook', id, ownerId);
    if (result) {
      return result;
    }
  }
  for (var tray of state.Desk) {
    const result = searchTicket (tray, tray.Tickets, 'tray', id, ownerId);
    if (result) {
      return result;
    }
  }
  return null;
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

function updateId (state, oldId, newId) {
  if (isSelected (state, oldId)) {
    clearSelected (state, oldId);
    setSelected (state, newId);
  }
  if (isExtended (state, oldId)) {
    clearExtended (state, oldId);
    setExtended (state, newId);
  }
  if (isFlash (state, oldId)) {
    clearFlash (state, oldId);
    setFlash (state, newId);
  }
}

// Return a deep copy of ticket, with new ids.
function clone (state, ticket) {
  const n = JSON.parse (JSON.stringify (ticket));
  const oldId = n.id;
  n.id = getNewId ();
  updateId (state, oldId, n.id);
  n.Trip.id = getNewId ();
  n.Trip.Pick.id = getNewId ();
  n.Trip.Drop.id = getNewId ();
  return n;
}

function normalize (ticket) {
  if (!ticket.Warning) {
    ticket.Warning = null;
  }
  return ticket;
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
function getNewTransit (state, ticket) {
  const n = clone (state, ticket);
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
  return n;
}

// Create a transit if a ticket is alone for a roadbook.
function createTransit (state, flashes, warnings, roadbookId) {
  const tickets = getRoadbookTickets (state, roadbookId);
  for (var ticket of tickets) {
    const same = getTicketsFromMissionId (tickets, ticket.Trip.MissionId);
    if (same.length === 1 && !isTicketIntoTray (state, ticket.Trip.MissionId)) {
      const newTicket = getNewTransit (state, ticket);
      flashes.push (newTicket.id);
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

function createTransits (state, flashes, warnings) {
  for (var readbook of state.Roadbooks) {
    createTransit (state, flashes, warnings, readbook.id);
  }
}

// Delete if there are unnecessary transits for a roadbook.
// By example, if a transit is alone, it's unnecessary.
// If there are 3 tickets, including 2 unnecessary, delete the 2 unnecessary tickets.
function deleteTransit (state, flashes, warnings, roadbookId) {
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

function deleteTransits (state, flashes, warnings) {
  for (var readbook of state.Roadbooks) {
    deleteTransit (state, flashes, warnings, readbook.id);
  }
}

// ------------------------------------------------------------------------------------------

// Check if un pick is under a drop, and set the field 'warning'.
function checkOrder (list, flashes, warnings) {
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
function checkOrders (state, flashes, warnings) {
  for (var readbook of state.Roadbooks) {
    checkOrder (readbook, flashes, warnings);
  }
  for (var tray of state.Desk) {
    checkOrder (tray, flashes, warnings);
  }
}

// ------------------------------------------------------------------------------------------

function checkAlone (state, flashes, warnings, roadbookId) {
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
function checkAlones (state, flashes, warnings) {
  for (var readbook of state.Roadbooks) {
    checkAlone (state, flashes, warnings, readbook.id);
  }
}

// ------------------------------------------------------------------------------------------

function updateShape (state, list) {
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
      list.Tickets[i] = clone (state, ticket);  // Trick necessary for update UI !!!
    }
  }
}

// Update shapes to all tickets into Roadbooks and Desk, for showing pick directly following by drop.
function updateShapes (state) {
  for (var readbook of state.Roadbooks) {
    updateShape (state, readbook);
  }
  for (var tray of state.Desk) {
    updateShape (state, tray);
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

function setMisc (state, list, flashes, warnings) {
  for (let i = 0; i < list.Tickets.length; i++) {
    const ticket = normalize (list.Tickets[i]);
    const w = getTextWarning (warnings, ticket.id);
    const f = (flashes.indexOf (ticket.id) !== -1);
    let s = isSelected (state, ticket.id);
    if (f) {
      s = false;  // if flash -> deselect item
    }
    if (ticket.Warning !== w ||
        isFlash (state, ticket.id) !== f ||
        isSelected (state, ticket.id) !== s) {  // changing ?
      ticket.Warning  = w;  // set or clear warning message
      putFlash (state, ticket.id, f);  // set or clear flash mode
      putSelected (state, ticket.id, s);  // select or deselect ticket
      list.Tickets[i] = clone (state, ticket);  // Trick necessary for update UI !!!
    }
  }
}

// Set flashes and warnings to all ticket into Roadbooks, Desk and Backlog.
function setMiscs (state, flashes, warnings) {
  for (var readbook of state.Roadbooks) {
    setMisc (state, readbook, flashes, warnings);
  }
  for (var tray of state.Desk) {
    setMisc (state, tray, flashes, warnings);
  }
  setMisc (state, state.Backlog, flashes, warnings);
}

// ------------------------------------------------------------------------------------------

function firstSelectedIndex (state, result) {
  for (let i = 0; i < result.tickets.length; i++) {
    const ticket = result.tickets[i];
    if (isSelected (state, ticket.id)) {
      return i;
    }
  }
  return 0;
}

function selectZone (state, result, fromIndex, toIndex, value) {
  for (let i = 0; i < result.tickets.length; i++) {
    const ticket = result.tickets[i];
    if (ticket.Status !== 'dispatched' && i >= fromIndex && i <= toIndex) {
      putSelected (state, ticket.id, value);
      result.tickets[i] = clone (state, ticket);  // Trick necessary for update UI !!!
    }
  }
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

function changeGeneric (state, flashes, warnings, from, to) {
  const ticket = from.ticket;
  if ((to.type === 'backlog' || to.type === 'tray') && ticket.Type.endsWith ('-transit')) {
    // Transit ticket does not move into backlog or desk.
    return;
  }

  // Delete the source.
  if (to.type === 'backlog' && ticket.Type !== 'both') {
    deleteMission (state, ticket.Trip.MissionId);
  } else {
    deleteTicket (from.tickets, ticket);
    if (from.ownerId === to.ownerId && from.index < to.index) {
      to.index--;  // decrease to take account of the deleted item
    }
  }

  // Set the destination.
  ticket.OwnerId = to.ownerId;
  if ((to.type === 'roadbook' || to.type === 'tray') && ticket.Type === 'both') {
    const pick = clone (state, ticket);
    const drop = clone (state, ticket);
    pick.Type = 'pick';
    drop.Type = 'drop';
    addTicket (to.tickets, to.index, drop);  // first drop, for have pick/drop in this order
    addTicket (to.tickets, to.index, pick);
    flashes.push (pick.id);
    flashes.push (drop.id);
  } else if (to.type === 'backlog' && ticket.Type !== 'both') {
    ticket.Type = 'both';
    ticket.Status = 'pre-dispatched';
    addTicket (to.tickets, to.index, ticket);
    flashes.push (ticket.id);
  } else {
    addTicket (to.tickets, to.index, ticket);
    flashes.push (ticket.id);
  }
}

// ------------------------------------------------------------------------------------------

// fromId    -> id to item to move.
// toId      -> id before which it is necessary to insert. If it was null, insert after the last item.
// toOwnerId -> owner where it is necessary to insert. Useful when toId is null.
function drop (state, fromIds, toId, toOwnerId) {
  console.log ('Reducer.drop');
  const flashes = [];
  const warnings = [];
  const to = searchId (state, toId, toOwnerId);
  if (!to) {
    return;
  }
  for (let i = fromIds.length - 1; i >= 0; i--) {
    const fromId = fromIds[i];
    const from = searchId (state, fromId);
    if (from) {
      changeGeneric (state, flashes, warnings, from, to);
    }
  }
  if (to.type === 'roadbook') {
    deleteTransits (state, flashes, warnings);
    createTransits (state, flashes, warnings);
  }
  checkOrders (state, flashes, warnings);
  checkAlones (state, flashes, warnings);
  setMiscs (state, flashes, warnings);
  updateShapes (state);
  return state;
}

function swapSelected (state, id, shiftKey) {
  const result = searchId (state, id);
  if (shiftKey) {
    if (isSelected (state, result.tickets[result.index].id)) {
      // Deselect all items.
      selectZone (state, result, 0, 9999, false);
    } else {
      // Select from first selected item to pointed item.
      let fromIndex = firstSelectedIndex (state, result);
      let toIndex = result.index;
      if (fromIndex > toIndex) {
        const x = fromIndex;
        fromIndex = toIndex;  // fromIndex <-> toIndex
        toIndex = x;
      }
      selectZone (state, result, fromIndex, toIndex, true);
    }
  } else {
    // Select or deselect pointed item.
    const ticket = result.tickets[result.index];
    if (ticket.Status !== 'dispatched') {
      putSelected (state, ticket.id, !isSelected (state, ticket.id));
      result.tickets[result.index] = clone (state, ticket);  // Trick necessary for update UI !!!
    }
  }
  return state;
}

function swapExtended (state, id) {
  const result = searchId (state, id);
  if (result.type !== 'backlog') {
    const ticket = result.tickets[result.index];
    if (isExtended (state, ticket.id)) {
      clearExtended (state, ticket.id);
    } else {
      setExtended (state, ticket.id);
    }
    result.tickets[result.index] = clone (state, ticket);  // Trick necessary for update UI !!!
  }
  return state;
}

function swapStatus (state, id) {
  const result = searchId (state, id);
  if (result.type === 'roadbook') {
    const ticket = result.tickets[result.index];
    if (ticket.Status === 'dispatched') {
      ticket.Status = 'pre-dispatched';
    } else {
      ticket.Status = 'dispatched';
      clearSelected (state, ticket.id);
    }
    result.tickets[result.index] = clone (state, ticket);  // Trick necessary for update UI !!!
  }
  return state;
}

// ------------------------------------------------------------------------------------------

export default function Reducer (state = {}, action = {}) {
  // console.log (`reducer action.type=${action.type}`);
  switch (action.type) {
    case 'DROP':
      state = drop (state, action.fromIds, action.toId, action.toOwnerId);
      break;

    case 'SWAP_SELECTED':
      state = swapSelected (state, action.id, action.shiftKey);
      break;
    case 'SWAP_EXTENDED':
      state = swapExtended (state, action.id);
      break;
    case 'SWAP_STATUS':
      state = swapStatus (state, action.id);
      break;

    case 'IS_SELECTED':
      state._isSelected = isSelected (state, action.id);
      break;
    case 'SET_SELECTED':
      state = setSelected (state, action.id);
      break;
    case 'CLEAR_SELECTED':
      state = clearSelected (state, action.id);
      break;

    case 'IS_EXTENDED':
      state._isExtended = isExtended (state, action.id);
      break;
    case 'SET_EXTENDED':
      state = setExtended (state, action.id);
      break;
    case 'CLEAR_EXTENDED':
      state = clearExtended (state, action.id);
      break;

    case 'IS_FLASH':
      state._isFlash = isFlash (state, action.id);
      break;
    case 'SET_FLASH':
      state = setFlash (state, action.id);
      break;
    case 'CLEAR_FLASH':
      state = clearFlash (state, action.id);
      break;
  }
  return state;
}
