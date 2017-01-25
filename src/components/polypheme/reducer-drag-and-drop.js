'use strict';

import Electrum from 'electrum';
import Enumerable from 'linq';
import reducerTickets from './reducer-tickets.js';
import {getTime} from './converters';

// ------------------------------------------------------------------------------------------

function searchTicket (root, items, type, id, ownerId) {
  if (id) {
    const item = Enumerable.from (items).where (item => item.id === id).firstOrDefault ();
    if (item) {
      return {
        ownerId: root.id,
        type:    type,
        tickets: items,
        ticket:  item,
        index:   Enumerable.from (items).indexOf (item => item.id === id),
      };
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

function searchKind (state, id) {
  const r = searchTicket (state.Backlog, state.Backlog.Tickets, 'backlog', id, null);
  if (r) {
    return r.type;
  }
  const m = searchTicket (state, state.Roadbooks, 'roadbooks', id, null);
  if (m) {
    return m.type;
  }
  for (var roadbook of state.Roadbooks) {
    const result = searchTicket (roadbook, roadbook.Tickets, 'roadbook', id, null);
    if (result) {
      return result.type;
    }
  }
  for (var tray of state.Desk) {
    const result = searchTicket (tray, tray.Tickets, 'tray', id, null);
    if (result) {
      return result.type;
    }
  }
  return null;
}

// ------------------------------------------------------------------------------------------

function electrumDispatch (state, type, id, value) {
  const kind = searchKind (state, id);
  Electrum.bus.dispatch (state, 'dnd', {
    type:  type,
    id:    id,
    kind:  kind,
    value: value,
  });
}

// ------------------------------------------------------------------------------------------

function isSelected (state, id) {
  if (!state.Selections) {
    state.Selections = [];
  }
  return state.Selections.indexOf (id) !== -1;
}

function setSelected (state, id) {
  const i = state.Selections.indexOf (id);
  if (i === -1) {
    state.Selections.push (id);
    electrumDispatch (state, 'setSelected', id);
  }
  return state;
}

function clearSelected (state, id) {
  const i = state.Selections.indexOf (id);
  if (i !== -1) {
    state.Selections.splice (i, 1);
    electrumDispatch (state, 'clearSelected', id);
  }
  return state;
}

function putSelected (state, id, value) {
  if (value) {
    return setSelected (state, id);
  } else {
    return clearSelected (state, id);
  }
}

// ------------------------------------------------------------------------------------------

function isExtended (state, id) {
  if (!state.Extendeds) {
    state.Extendeds = [];
  }
  return state.Extendeds.indexOf (id) !== -1;
}

function setExtended (state, id) {
  const i = state.Extendeds.indexOf (id);
  if (i === -1) {
    state.Extendeds.push (id);
    electrumDispatch (state, 'setExtended', id);
  }
  return state;
}

function clearExtended (state, id) {
  const i = state.Extendeds.indexOf (id);
  if (i !== -1) {
    state.Extendeds.splice (i, 1);
    electrumDispatch (state, 'clearExtended', id);
  }
  return state;
}

function putExtended (state, id, value) {
  if (value) {
    return setExtended (state, id);
  } else {
    return clearExtended (state, id);
  }
}

// ------------------------------------------------------------------------------------------

function isFlash (state, id) {
  if (!state.Flashes) {
    state.Flashes = [];
  }
  return state.Flashes.indexOf (id) !== -1;
}

function setFlash (state, id) {
  const i = state.Flashes.indexOf (id);
  if (i === -1) {
    state.Flashes.push (id);
    electrumDispatch (state, 'setFlash', id);
  }
  return state;
}

function clearFlash (state, id) {
  const i = state.Flashes.indexOf (id);
  if (i !== -1) {
    state.Flashes.splice (i, 1);
    electrumDispatch (state, 'clearFlash', id);
  }
  return state;
}

function putFlash (state, id, value) {
  if (value) {
    return setFlash (state, id);
  } else {
    return clearFlash (state, id);
  }
}

// ------------------------------------------------------------------------------------------

function addTicket (state, tickets, index, ticket) {
  tickets = reducerTickets (tickets, {
    type:   'ADD_TICKET',
    index:  index,
    ticket: ticket,
  });
  electrumDispatch (state, 'addTicket', ticket.id, {index: index, ticket: ticket});
}

function deleteTicket (state, tickets, ticket) {
  tickets = reducerTickets (tickets, {
    type:   'DELETE_TICKET',
    ticket: ticket,
  });
  electrumDispatch (state, 'deleteTicket', ticket.id);
}

// ------------------------------------------------------------------------------------------

// Return all tickets, grouped by MissionId. Example:
// {
//    missionId1: [pick, drop],
//    missionId2: [pick, drop-transit],
//    missionId3: [pick],        // miss the drop
//    missionId4: [drop, pick],  // bad order
//    ...
// }
function getMissions (tickets) {
  const result = new Map ();
  for (var ticket of tickets) {
    const missionId = ticket.Trip.MissionId;
    if (result.has (missionId)) {
      result.get (missionId).push (ticket);
    } else {
      result.set (missionId, [ticket]);
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
  return n;
}

// Trick necessary for update UI !!!
function regen (state, ticket) {
  const n = JSON.parse (JSON.stringify (ticket));
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
  return Enumerable
    .from (state.Desk)
    .selectMany (tray => tray.Tickets)
    .where (ticket => ticket.Trip.MissionId === missionId)
    .any ();
}

// Return new ticket for transit. If it's a pick, create a drop zone for transit, and reverse.
function getNewTransit (state, ticket) {
  const n = clone (state, ticket);
  if (n.Type.startsWith ('pick')) {
    n.Type = 'drop-transit';
    n.Trip.Drop.LongDescription = null;
    n.Trip.Drop.Notes = [];
    n.Trip.Drop.PlanedDate = ticket.Trip.Pick.PlanedDate;
    n.Trip.Drop.PlanedTime = ticket.Trip.Pick.PlanedTime;
    n.Trip.Drop.ShortDescription = 'Inconnu';
    n.Trip.Drop.Zone = null;
  } else if (n.Type.startsWith ('drop')) {
    n.Type = 'pick-transit';
    n.Trip.Pick.LongDescription = null;
    n.Trip.Pick.Notes = [];
    n.Trip.Pick.PlanedDate = ticket.Trip.Drop.PlanedDate;
    n.Trip.Pick.PlanedTime = ticket.Trip.Drop.PlanedTime;
    n.Trip.Pick.ShortDescription = 'Inconnu';
    n.Trip.Pick.Zone = null;
  }
  return n;
}

// Create a transit if a ticket is alone for a roadbook.
function createTransits (state, flashes, warnings) {
  for (var roadbook of state.Roadbooks) {
    const tickets = roadbook.Tickets;
    getMissions (roadbook.Tickets).forEach ((list, missionId) => {
      if (list.length === 1 && !isTicketIntoTray (state, missionId)) {
        const ticket = list[0];
        const newTicket = getNewTransit (state, ticket);
        flashes.push (newTicket.id);
        const index = tickets.indexOf (ticket);
        if (newTicket.Type.startsWith ('pick')) {
          addTicket (state, tickets, index, newTicket);
        } else {
          addTicket (state, tickets, index + 1, newTicket);
        }
        warnings.push ({id: newTicket.id, text: 'Transit à définir'});
      }
    });
  }
}

// Delete if there are unnecessary transits for a roadbook.
// By example, if a transit is alone, it's unnecessary.
// If there are 3 tickets, including 2 unnecessary, delete the 2 unnecessary tickets.
function deleteTransits (state, flashes, warnings) {
  for (var roadbook of state.Roadbooks) {
    const tickets = roadbook.Tickets;
    getMissions (tickets).forEach (list => {
      if (list.length % 2 === 1) {  // odd number of tickets ?
        Enumerable
          .from (list)
          .where (ticket => ticket.Type.endsWith ('-transit'))
          .forEach (ticket => deleteTicket (state, tickets, ticket));
      }
    });
  }
}

// ------------------------------------------------------------------------------------------

// Check if un pick is under a drop, and set the field 'warning'.
function checkOrder (tickets, flashes, warnings) {
  getMissions (tickets).forEach (list => {
    if (list.length === 2 && list[0].Order > list[1].Order) {
      warnings.push ({id: list[0].id, text: 'Drop avant pick'});
      warnings.push ({id: list[1].id, text: 'Pick après drop'});
    }
  });
}

// Check if picks are under drops into all Roadbooks.
function checkOrders (state, flashes, warnings) {
  for (var roadbook of state.Roadbooks) {
    checkOrder (roadbook.Tickets, flashes, warnings);
  }
  for (var tray of state.Desk) {
    checkOrder (tray.Tickets, flashes, warnings);
  }
}

// Get sorting order :
//  Type = 'pick'          -> 1
//  Type = 'drop-transit'  -> 2
//  Type = 'pick-transit'  -> 3
//  Type = 'drop'          -> 4
function getSortingTicketOrder (ticket) {
  const type = ticket.Type;
  if (type.startsWith ('pick')) {
    if (type.endsWith ('-transit')) {
      return 3;
    } else {
      return 1;
    }
  } else if (type.startsWith ('drop')) {
    if (type.endsWith ('-transit')) {
      return 2;
    } else {
      return 4;
    }
  } else {
    throw new Error (`Unknown sorted type ${type}`);
  }
}

function sortTicket (a, b) {
  const sa = getSortingTicketOrder (a).toString ();
  const sb = getSortingTicketOrder (b).toString ();
  if (sa === sb) {
    // If they have the same type, sort chronologically.
    const ta = getTime (a.Trip.Drop.PlanedTime);
    const tb = getTime (b.Trip.Drop.PlanedTime);
    return ta.localeCompare (tb);
  } else {
    return sa.localeCompare (sb);
  }
}

// Returns all tickets from the same mission, sorted chronologically.
// By example: pick, pick-transit, drop-transit and drop.
function getSorteTicketsFromMissionId (state, missionId) {
  const roadbookTickets = Enumerable
    .from (state.Roadbooks)
    .selectMany (roadbook => roadbook.Tickets)
    .where (ticket => ticket.Trip.MissionId === missionId);
  const trayTickets = Enumerable
    .from (state.Desk)
    .selectMany (tray => tray.Tickets)
    .where (ticket => ticket.Trip.MissionId === missionId);
  return roadbookTickets.union (trayTickets).toArray ().sort (sortTicket);
}

function setOrder (state, ticket, order) {
  if (ticket.Order !== order) {
    ticket.Order = order;
    electrumDispatch (state, 'setOrder', ticket.id, order);
  }
}

function updateListOrders (state, list) {
  Enumerable.from (list).where (ticket => ticket.Type === 'pick').forEach (ticket => {
    const tickets = getSorteTicketsFromMissionId (state, ticket.Trip.MissionId);
    for (let i = 0; i < tickets.length; i++) {
      const t = tickets[i];
      setOrder (state, t, i);
    }
  });
}

// Update order to all ticket into Roadbooks and Desk.
function updateOrders (state) {
  // console.log ('reducer.updateOrders');
  for (var roadbook of state.Roadbooks) {
    updateListOrders (state, roadbook.Tickets);
  }
  for (var tray of state.Desk) {
    updateListOrders (state, tray.Tickets);
  }
}

// ------------------------------------------------------------------------------------------

// Add a warning to all tickets into Roadbooks we are alone.
function checkAlones (state, flashes, warnings) {
  for (var roadbook of state.Roadbooks) {
    getMissions (roadbook.Tickets).forEach (list => {
      if (list.length === 1) {
        const ticket = list[0];
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
    });
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
      list.Tickets[i] = regen (state, ticket);
    }
  }
}

// Update shapes to all tickets into Roadbooks and Desk, for showing pick directly following by drop.
function updateShapes (state) {
  for (var roadbook of state.Roadbooks) {
    updateShape (state, roadbook);
  }
  for (var tray of state.Desk) {
    updateShape (state, tray);
  }
}

// ------------------------------------------------------------------------------------------

function getTextWarning (warnings, id) {
  return Enumerable
    .from (warnings)
    .where (warning => warning.id === id)
    .select (warning => warning.text)
    .firstOrDefault ();
}

function setMisc (state, list, flashes, warnings) {
  for (let i = 0; i < list.length; i++) {
    const ticket = normalize (list[i]);
    const w = getTextWarning (warnings, ticket.id);
    const f = (flashes.indexOf (ticket.id) !== -1);
    let s = isSelected (state, ticket.id);
    if (ticket.Warning !== w ||
        isFlash (state, ticket.id) !== f ||
        isSelected (state, ticket.id) !== s) {  // changing ?
      ticket.Warning  = w;  // set or clear warning message
      putFlash (state, ticket.id, f);  // set or clear flash mode
      putSelected (state, ticket.id, s);  // select or deselect ticket
      list[i] = regen (state, ticket);
    }
  }
}

// Set flashes and warnings to all ticket into Roadbooks, Desk and Backlog.
function setMiscs (state, flashes, warnings) {
  for (var roadbook of state.Roadbooks) {
    setMisc (state, roadbook.Tickets, flashes, warnings);
  }
  for (var tray of state.Desk) {
    setMisc (state, tray.Tickets, flashes, warnings);
  }
  setMisc (state, state.Backlog.Tickets, flashes, warnings);
  setMisc (state, state.Roadbooks, flashes, warnings);
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

function selectZone (state, flashes, result, fromIndex, toIndex, value) {
  for (let i = 0; i < result.tickets.length; i++) {
    const ticket = result.tickets[i];
    if ((ticket.Status === 'backlog' || ticket.Status === 'pre-dispatched') && i >= fromIndex && i <= toIndex) {
      if (isSelected (state, ticket.id) !== value) {
        putSelected (state, ticket.id, value);
        result.tickets[i] = regen (state, ticket);
        flashes.push (result.tickets[i].id);
      }
    }
  }
}

// ------------------------------------------------------------------------------------------

// Delete all residual tickets into Roadbooks and Desk.
function deleteMission (state, missionId) {
  Enumerable
    .from (state.Roadbooks)
    .forEach (
      roadbook => Enumerable
        .from (roadbook.Tickets)
        .where (ticket => ticket.Trip.MissionId === missionId)
        .toArray ()
        .forEach (ticket => deleteTicket (state, roadbook.Tickets, ticket)
      )
    );
  Enumerable
    .from (state.Desk)
    .forEach (
      roadbook => Enumerable
        .from (roadbook.Tickets)
        .where (ticket => ticket.Trip.MissionId === missionId)
        .toArray ()
        .forEach (ticket => deleteTicket (state, roadbook.Tickets, ticket)
      )
    );
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
    deleteTicket (state, from.tickets, ticket);
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
    pick.Status = 'pre-dispatched';
    drop.Status = 'pre-dispatched';
    addTicket (state, to.tickets, to.index, drop);  // first drop, for have pick/drop in this order
    addTicket (state, to.tickets, to.index, pick);
    clearSelected (state, pick.id);
    clearSelected (state, drop.id);
    flashes.push (pick.id);
    flashes.push (drop.id);
  } else if (to.type === 'backlog' && ticket.Type !== 'both') {
    ticket.Type = 'both';
    ticket.Status = 'backlog';
    addTicket (state, to.tickets, to.index, ticket);
    clearSelected (state, ticket.id);
    flashes.push (ticket.id);
  } else {
    addTicket (state, to.tickets, to.index, ticket);
    clearSelected (state, ticket.id);
    flashes.push (ticket.id);
  }
}

// ------------------------------------------------------------------------------------------

// fromId    -> id to item to move.
// toId      -> id before which it is necessary to insert. If it was null, insert after the last item.
// toOwnerId -> owner where it is necessary to insert. Useful when toId is null.
function drop (state, fromKind, fromIds, toId, toOwnerId, toOwnerKind) {
  // console.log ('Reducer.drop');
  const flashes = [];
  const warnings = [];
  const to = searchId (state, toId, toOwnerId);
  if (!to) {
    return;
  }
  Enumerable.from (fromIds).reverse ().forEach (fromId => {
    const from = searchId (state, fromId);
    if (from) {
      changeGeneric (state, flashes, warnings, from, to);
    }
  });
  if (to.type === 'roadbook' || to.type === 'tray') {
    deleteTransits (state, flashes, warnings);
    createTransits (state, flashes, warnings);
  }
  updateOrders (state);
  checkOrders (state, flashes, warnings);
  checkAlones (state, flashes, warnings);
  setMiscs (state, flashes, warnings);
  updateShapes (state);

  // // Send action to electrum.
  // Electrum.bus.dispatch (state, 'dnd', {
  //   type:         'drop',
  //   itemKind:     fromKind,
  //   itemIds:      fromIds,
  //   beforeItemId: toId,
  //   toOwnerId:    toOwnerId,
  //   toOwnerKind:  toOwnerKind,
  // });

  return state;
}

function swapSelected (state, id, shiftKey) {
  const flashes = [];
  const warnings = [];
  const result = searchId (state, id);
  if (shiftKey) {
    if (isSelected (state, result.tickets[result.index].id)) {
      // Deselect all items.
      selectZone (state, flashes, result, 0, 9999, false);
    } else {
      // Select from first selected item to pointed item.
      let fromIndex = firstSelectedIndex (state, result);
      let toIndex = result.index;
      if (fromIndex > toIndex) {
        const x = fromIndex;
        fromIndex = toIndex;  // fromIndex <-> toIndex
        toIndex = x;
      }
      selectZone (state, flashes, result, fromIndex, toIndex, true);
    }
  } else {
    // Select or deselect pointed item.
    const ticket = result.tickets[result.index];
    if (ticket.Status === 'backlog' || ticket.Status === 'pre-dispatched') {
      putSelected (state, ticket.id, !isSelected (state, ticket.id));
      result.tickets[result.index] = regen (state, ticket);
      flashes.push (result.tickets[result.index].id);
    }
  }
  setMiscs (state, flashes, warnings);
  return state;
}

function swapExtended (state, id) {
  // console.log ('reducer.swapExtended');
  const flashes = [];
  const warnings = [];
  const result = searchId (state, id);
  if (result.type !== 'backlog') {
    const ticket = result.tickets[result.index];
    if (isExtended (state, ticket.id)) {
      clearExtended (state, ticket.id);
    } else {
      setExtended (state, ticket.id);
    }
    result.tickets[result.index] = regen (state, ticket);
    flashes.push (result.tickets[result.index].id);
  }
  setMiscs (state, flashes, warnings);
  return state;
}

// Change the status of a single tickets.
function setStatus (state, flashes, id, value, date, time) {
  const result = searchId (state, id);
  const ticket  = result.ticket;
  const tickets = result.tickets;
  const index   = result.index;
  ticket.Status = value;
  if (value !== 'pre-dispatched') {
    clearSelected (state, ticket.id);
  }
  if (value === 'delivered') {
    ticket.Trip.Pick.RealisedDate = date;
    ticket.Trip.Pick.RealisedTime = time;
    ticket.Trip.Drop.RealisedDate = date;
    ticket.Trip.Drop.RealisedTime = time;
  } else {
    ticket.Trip.Pick.RealisedDate = null;
    ticket.Trip.Pick.RealisedTime = null;
    ticket.Trip.Drop.RealisedDate = null;
    ticket.Trip.Drop.RealisedTime = null;
  }
  tickets[index] = regen (state, ticket);
  flashes.push (tickets[index].id);
  electrumDispatch (state, 'setStatus', tickets[index].id, {value: value, date: date, time: time});
}

// Returns the index of a status, to determine the direction of the operation (ascending or descending).
function getStatusIndex (value) {
  return {
    ['pre-dispatched']: 1,
    dispatched:         2,
    delivered:          3,
  } [value];
}

function changeStatusNecessary (ascending, refTicket, otherTicket, newValue) {
  // console.log ('reducer.changeStatusNecessary');
  const refOrder   = refTicket.Order   ? refTicket.Order   : 0;
  const otherOrder = otherTicket.Order ? otherTicket.Order : 0;
  const refStatusIndex   = getStatusIndex (refTicket.Status);
  const otherStatusIndex = getStatusIndex (otherTicket.Status);
  if (ascending) {  // pre-dispatched > dispatched > delivered ?
    // Propage changes to older tickets.
    if (newValue === 'dispatched') {
      // Restricted change to tickets from the same messenger.
      return otherStatusIndex <= refStatusIndex && otherOrder <= refOrder && refTicket.OwnerId === otherTicket.OwnerId;
    } else {
      return otherStatusIndex <= refStatusIndex && otherOrder <= refOrder;
    }
  } else {  // delivered > dispatched > pre-dispatched ?
    // Propage change the tickets more resent.
    return otherStatusIndex >= refStatusIndex && otherOrder >= refOrder;
  }
}

// Change the status of (almost) all tickets, according to subtle business rules.
function setBothStatus (state, flashes, ticket, currentValue, newValue, date, time) {
  const ascending = getStatusIndex (currentValue) < getStatusIndex (newValue);
  const tickets = getSorteTicketsFromMissionId (state, ticket.Trip.MissionId);
  for (var otherTicket of tickets) {
    if (changeStatusNecessary (ascending, ticket, otherTicket, newValue)) {
      setStatus (state, flashes, otherTicket.id, newValue, date, time);
    }
  }
}

function swapStatus (state, id) {
  const flashes = [];
  const warnings = [];
  const result = searchId (state, id);
  if (result.type === 'roadbook') {
    const currentValue = result.tickets[result.index].Status;
    let newValue;
    if (currentValue === 'dispatched') {
      newValue = 'delivered';
    } else if (currentValue === 'delivered') {
      newValue = 'pre-dispatched';
    } else {
      newValue = 'dispatched';
    }
    setBothStatus (state, flashes, result.ticket, currentValue, newValue);
  }
  setMiscs (state, flashes, warnings);
  return state;
}

function changeStatus (state, id, newValue, date, time) {
  const flashes = [];
  const warnings = [];
  const result = searchId (state, id);
  if (result.type === 'roadbook') {
    const currentValue = result.tickets[result.index].Status;
    setBothStatus (state, flashes, result.ticket, currentValue, newValue, date, time);
  }
  setMiscs (state, flashes, warnings);
  return state;
}

function swapRoadbookCompacted (state, id) {
  const result = searchId (state, id);
  if (result.type !== 'roadbooks') {
    throw new Error (`Invalid type ${result.type}`);
  }
  const roadbook = result.tickets[result.index];
  if (roadbook.Compacted === 'true') {
    roadbook.Compacted = 'false';
  } else {
    roadbook.Compacted = 'true';
  }
  result.tickets[result.index] = regen (state, roadbook);
  return state;
}

function swapRoadbookShowHidden (state, id) {
  const result = searchId (state, id);
  if (result.type !== 'roadbooks') {
    throw new Error (`Invalid type ${result.type}`);
  }
  const roadbook = result.tickets[result.index];
  if (roadbook.ShowHidden === 'true') {
    roadbook.ShowHidden = 'false';
  } else {
    roadbook.ShowHidden = 'true';
  }
  result.tickets[result.index] = regen (state, roadbook);
  return state;
}

function setTrayName (state, id, value) {
  Enumerable.from (state.Desk).where (tray => tray.id === id).forEach (tray => {
    tray.Name = value;
    electrumDispatch (state, 'setTrayName', id, value);
  });
}

// ------------------------------------------------------------------------------------------

export default function Reducer (state = {}, action = {}) {
  console.log (`reducer action.type=${action.type}`);
  switch (action.type) {
    case 'DROP':
      state = drop (state, action.fromKind, action.fromIds, action.toId, action.toOwnerId, action.toOwnerKind);
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
    case 'CHANGE_STATUS':
      state = changeStatus (state, action.id, action.value, action.date, action.time);
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

    case 'SWAP_ROADBOOK_COMPACTED':
      state = swapRoadbookCompacted (state, action.id);
      break;
    case 'SWAP_ROADBOOK_SHOWHIDDEN':
      state = swapRoadbookShowHidden (state, action.id);
      break;

    case 'SET_TRAY_NAME':
      state = setTrayName (state, action.id, action.value);
      break;
  }
  return state;
}
