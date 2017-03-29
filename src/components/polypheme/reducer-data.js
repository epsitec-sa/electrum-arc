import Electrum from 'electrum';
import {Trace} from 'electrum';
import Enumerable from 'linq';
import ReducerTickets from './reducer-tickets.js';
import Converters from './converters';
import StateManager from './state-manager.js';

function updateUI () {
  for (var c of window.document.toUpdate) {
    c.forceUpdate ();
  }
}

// ------------------------------------------------------------------------------------------

function partialSearchFromId (root, items, kind, id, ownerId) {
  if (id) {
    const item = Enumerable.from (items).where (item => item.id === id).firstOrDefault ();
    if (item) {
      return {
        ownerId: root.id,
        kind:    kind,
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
      kind:    kind,
      tickets: items,
      ticket:  ticket,
      index:   items.length,
    };
  }
  return null;
}

// Performs a depth search from a id, in the known data set (backlog, roadbooks, roadbook and tray).
// The result can be:
//   - a ticket in backlog, a roadbook or a tray of desk
//   - a roadbook in roadbooks
//   - a tray in desk
function deepSearchFromId (state, id, ownerId) {
  const r = partialSearchFromId (state.Backlog, state.Backlog.Tickets, 'backlog', id, ownerId);
  if (r) {
    return r;  // ticket in backlog
  }
  const m = partialSearchFromId (state, state.Roadbooks, 'roadbooks', id, ownerId);
  if (m) {
    return m;  // roadbook in a roadbooks
  }
  const d = partialSearchFromId (state, state.Desk, 'desk', id, ownerId);
  if (d) {
    return d;  // tray in desk
  }
  for (var roadbook of state.Roadbooks) {
    const result = partialSearchFromId (roadbook, roadbook.Tickets, 'roadbook', id, ownerId);
    if (result) {
      return result;  // ticket in roadbook
    }
  }
  for (var tray of state.Desk) {
    const result = partialSearchFromId (tray, tray.Tickets, 'tray', id, ownerId);
    if (result) {
      return result;  // ticket in a tray of desk
    }
  }
  return null;
}

// ------------------------------------------------------------------------------------------

function electrumDispatch (state, oper, payload) {
  if (payload.TicketId) {
    // If payload contains a 'TicketId', inject 'Kind'.
    const result = deepSearchFromId (state, payload.TicketId);
    payload.Kind = result.kind;
  } else if (payload.TrayId) {
    // If payload contains a 'TrayId', inject 'Kind'.
    const result = deepSearchFromId (state, payload.TrayId);
    payload.Kind = result.kind;
  } else if (payload.MessengerId) {
    // If payload contains a 'MessengerId', inject 'Kind'.
    const result = deepSearchFromId (state, payload.MessengerId);
    payload.Kind = result.kind;
  }
  Trace.log ('ReducerData.electrumDispatch ' + oper);
  Trace.dir (payload);
  Electrum.bus.postEnvelope (oper, payload);
}

// ------------------------------------------------------------------------------------------

function addTicket (state, tickets, index, ticket) {
  tickets = ReducerTickets.reducer (tickets, {
    type:   'ADD_TICKET',
    index:  index,
    ticket: ticket,
  });
}

function deleteTicket (state, tickets, ticket) {
  tickets = ReducerTickets.reducer (tickets, {
    type:   'DELETE_TICKET',
    ticket: ticket,
  });
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
    const missionId = ticket.MissionId;
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

// Return a deep copy of ticket, with new ids.
function clone (state, ticket) {
  const n = JSON.parse (JSON.stringify (ticket));
  const oldId = n.id;
  n.id = getNewId ();
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
    .where (ticket => ticket.MissionId === missionId)
    .any ();
}

// Return new ticket for transit. If it's a pick, create a drop zone for transit, and reverse.
function getNewTransit (state, ticket) {
  const n = clone (state, ticket);
  if (n.Type.startsWith ('pick')) {
    n.Type = 'drop-transit';
    n.MeetingPoint.LongDescription = null;
    n.MeetingPoint.Notes = [];
    n.MeetingPoint.PlanedDate      = ticket.MeetingPoint.PlanedDate;
    n.MeetingPoint.StartPlanedTime = ticket.MeetingPoint.StartPlanedTime;
    n.MeetingPoint.EndPlanedTime   = ticket.MeetingPoint.EndPlanedTime;
    n.MeetingPoint.ShortDescription = 'Inconnu';
    n.MeetingPoint.Zone = null;
  } else if (n.Type.startsWith ('drop')) {
    n.Type = 'pick-transit';
    n.MeetingPoint.LongDescription = null;
    n.MeetingPoint.Notes = [];
    n.MeetingPoint.PlanedDate      = ticket.MeetingPoint.PlanedDate;
    n.MeetingPoint.StartPlanedTime = ticket.MeetingPoint.StartPlanedTime;
    n.MeetingPoint.EndPlanedTime   = ticket.MeetingPoint.EndPlanedTime;
    n.MeetingPoint.ShortDescription = 'Inconnu';
    n.MeetingPoint.Zone = null;
  }
  return n;
}

// Create a transit if a ticket is alone for a roadbook.
function createTransits (state, flashes, warnings) {
  for (var roadbook of state.Roadbooks) {
    const tickets = roadbook.Tickets;
    getMissions (roadbook.Tickets).forEach ((list, missionId) => {
      if (list.length === 1 && (list[0].Type === 'pick' || list[0].Type === 'drop') && !isTicketIntoTray (state, missionId)) {
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
//  Type = 'task'          -> 5
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
    return 5;
  }
}

function sortTicket (a, b) {
  const sa = getSortingTicketOrder (a).toString ();
  const sb = getSortingTicketOrder (b).toString ();
  if (sa === sb) {
    // If they have the same type, sort chronologically.
    const ta = Converters.getFormatedTime (a.MeetingPoint.StartPlanedTime);
    const tb = Converters.getFormatedTime (b.MeetingPoint.StartPlanedTime);
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
    .where (ticket => ticket.MissionId === missionId);
  const trayTickets = Enumerable
    .from (state.Desk)
    .selectMany (tray => tray.Tickets)
    .where (ticket => ticket.MissionId === missionId);
  return roadbookTickets.union (trayTickets).toArray ().sort (sortTicket);
}

function setOrder (state, ticket, order) {
  if (ticket.Order !== order) {
    ticket.Order = order;
  }
}

function updateListOrders (state, list) {
  Enumerable.from (list).where (ticket => ticket.Type === 'pick').forEach (ticket => {
    const tickets = getSorteTicketsFromMissionId (state, ticket.MissionId);
    for (let i = 0; i < tickets.length; i++) {
      const t = tickets[i];
      setOrder (state, t, i);
    }
  });
}

// Update order to all ticket into Roadbooks and Desk.
function updateOrders (state) {
  // Trace.log ('reducer.updateOrders');
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
      if (list.length === 1 && list[0].Type !== 'task') {
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

function updateShape (state, list, isBacklog) {
  for (let i = 0; i < list.Tickets.length; i++) {
    const ticket = list.Tickets[i];
    let shape = 'normal';
    if (!isBacklog) {
      if (i < list.Tickets.length - 1) {
        const other = list.Tickets[i + 1];
        if (ticket.MissionId === other.MissionId &&
          ticket.Type.startsWith ('pick') &&
          other.Type.startsWith ('drop')) {  // pick following by drop ?
          shape = 'first';
        }
      }
      if (i > 0) {
        const other = list.Tickets[i - 1];
        if (ticket.MissionId === other.MissionId &&
          ticket.Type.startsWith ('drop') &&
          other.Type.startsWith ('pick')) {  // drop preceded by pick ?
          shape = 'last';
        }
      }
    }
    if (StateManager.getTicketShape (ticket.id) !== shape) {  // changing ?
      StateManager.setTicketShape (ticket.id, shape);
      list.Tickets[i] = regen (state, ticket);
    }
  }
}

// Update shapes to all tickets into Roadbooks and Desk, for showing pick directly following by drop.
function updateShapes (state) {
  updateShape (state, state.Backlog, true);

  for (var roadbook of state.Roadbooks) {
    updateShape (state, roadbook, false);
  }
  for (var tray of state.Desk) {
    updateShape (state, tray, false);
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
    const f = (flashes.indexOf (ticket.id) !== -1) ? 'true' : 'false';
    let s = ticket.Selected === 'true';
    if (ticket.Warning !== w ||
        ticket.Flash !== f ||
        ticket.Selected !== s) {  // changing ?
      ticket.Warning  = w;  // set or clear warning message
      ticket.Flash = f;  // set or clear flash mode
      ticket.Selected = s ? 'true' : 'false';  // select or deselect ticket
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
    if (ticket.Selected === 'true') {
      return i;
    }
  }
  return 0;
}

function selectZone (state, flashes, result, fromIndex, toIndex, value) {
  for (let i = 0; i < result.tickets.length; i++) {
    const ticket = result.tickets[i];
    if ((ticket.Status === 'backlog' || ticket.Status === 'pre-dispatched') && i >= fromIndex && i <= toIndex) {
      if ((ticket.Selected === 'true') !== value) {
        ticket.Selected = value ? 'true' : 'false';
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
    .forEach (roadbook => Enumerable
      .from (roadbook.Tickets)
      .where (ticket => ticket.MissionId === missionId)
      .toArray ()
      .forEach (ticket => deleteTicket (state, roadbook.Tickets, ticket))
    );
  Enumerable
    .from (state.Desk)
    .forEach (roadbook => Enumerable
      .from (roadbook.Tickets)
      .where (ticket => ticket.MissionId === missionId)
      .toArray ()
      .forEach (ticket => deleteTicket (state, roadbook.Tickets, ticket))
    );
}

function dropGeneric (state, flashes, warnings, from, to) {
  const ticket = from.ticket;
  if ((to.kind === 'backlog' || to.kind === 'tray') && ticket.Type.endsWith ('-transit')) {
    // Transit ticket does not move into backlog or desk.
    return;
  }

  // Delete the source.
  // if (to.kind === 'backlog' || from.kind === 'backlog') {
  //   deleteMission (state, ticket.MissionId);
  // } else {
  deleteTicket (state, from.tickets, ticket);
  if (from.ownerId === to.ownerId && from.index < to.index) {
    to.index--;  // decrease to take account of the deleted item
  }
  // }

  // Set the destination.
  ticket.OwnerId = to.ownerId;
  if ((to.kind === 'roadbook' || to.kind === 'tray') && ticket.Type === 'both') {
    const pick = clone (state, ticket);
    const drop = clone (state, ticket);
    pick.Type = 'pick';
    drop.Type = 'drop';
    pick.Status = 'pre-dispatched';
    drop.Status = 'pre-dispatched';
    addTicket (state, to.tickets, to.index, drop);  // first drop, for have pick/drop in this order
    addTicket (state, to.tickets, to.index, pick);
    pick.Selected = 'false';
    drop.Selected = 'false';
    flashes.push (pick.id);
    flashes.push (drop.id);
  } else if (to.kind === 'backlog' && ticket.Type !== 'both') {
    // ticket.Type = 'both';
    ticket.Status = 'backlog';
    addTicket (state, to.tickets, to.index, ticket);
    ticket.Selected = 'false';
    flashes.push (ticket.id);
  } else {
    addTicket (state, to.tickets, to.index, ticket);
    ticket.Selected = 'false';
    flashes.push (ticket.id);
  }
}

// ------------------------------------------------------------------------------------------

function initialise (state) {
  updateShapes (state);
  return state;
}

// fromId    -> id to item to move.
// toId      -> id before which it is necessary to insert. If it was null, insert after the last item.
// toOwnerId -> owner where it is necessary to insert. Useful when toId is null.
function drop (state, fromKind, fromIds, toId, toOwnerId, toOwnerKind) {
  Trace.log ('Reducer.drop');
  if (window.document.mock) {
    const flashes = [];
    const warnings = [];
    const to = deepSearchFromId (state, toId, toOwnerId);
    if (!to) {
      return;
    }
    Enumerable.from (fromIds).reverse ().forEach (fromId => {
      const from = deepSearchFromId (state, fromId);
      if (from) {
        dropGeneric (state, flashes, warnings, from, to);
      }
    });
    if (to.kind === 'roadbook' || to.kind === 'tray') {
      deleteTransits (state, flashes, warnings);
      createTransits (state, flashes, warnings);
    }
    updateOrders (state);
    checkOrders (state, flashes, warnings);
    checkAlones (state, flashes, warnings);
    setMiscs (state, flashes, warnings);
    updateShapes (state);
    updateUI ();
  } else {
    Enumerable.from (fromIds).forEach (fromId => {
      const from = deepSearchFromId (state, fromId);
      if (from) {
        from.ticket.Selection = 'false';
        deleteTicket (state, from.tickets, from.ticket);
      }
    });
    updateUI ();
    electrumDispatch (state, 'MoveTicketCommand', {
      ItemKind:     fromKind,
      ItemIds:      fromIds[0], // TODO: HACK
      BeforeItemId: toId,
      ToOwnerId:    toOwnerId,
      ToOwnerKind:  toOwnerKind,
    });
  }
  return state;
}

function swapTicketSelected (state, id, shiftKey) {
  const flashes = [];
  const warnings = [];
  const result = deepSearchFromId (state, id);
  if (shiftKey) {
    if (result.ticket.Selected === 'true') {
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
      ticket.Selected = (ticket.Selected === 'true') ? 'false' : 'true';
      result.tickets[result.index] = regen (state, ticket);
      flashes.push (result.tickets[result.index].id);
    }
  }
  setMiscs (state, flashes, warnings);
  updateUI ();
  return state;
}

function swapTicketExtended (state, id) {
  // Trace.log ('reducer.swapTicketExtended');
  const flashes = [];
  const warnings = [];
  const result = deepSearchFromId (state, id);
  // if (result.kind !== 'backlog') {
  if (true) {
    const ticket = result.tickets[result.index];
    const x = ticket.Extended === 'true';
    ticket.Extended = x ? 'false' : 'true';
    result.tickets[result.index] = regen (state, ticket);
    flashes.push (result.tickets[result.index].id);
  }
  setMiscs (state, flashes, warnings);
  updateUI ();
  return state;
}

// Change the status of a single tickets.
function setStatus (state, flashes, id, status, date, time) {
  const result = deepSearchFromId (state, id);
  const ticket  = result.ticket;
  const tickets = result.tickets;
  const index   = result.index;
  ticket.Status = status;
  if (status !== 'pre-dispatched') {
    ticket.Selected = 'false';
  }
  if (status === 'delivered') {
    ticket.MeetingPoint.RealisedDate = date;
    ticket.MeetingPoint.RealisedTime = time;
  } else {
    ticket.MeetingPoint.RealisedDate = Converters.getEmptyDate ();
    ticket.MeetingPoint.RealisedTime = Converters.getEmptyTime ();
  }
  tickets[index] = regen (state, ticket);
  flashes.push (tickets[index].id);
}

// Returns the index of a status, to determine the direction of the operation (ascending or descending).
function getStatusIndex (status) {
  const index = {
    ['pre-dispatched']: 1,
    dispatched:         2,
    delivered:          3,
  } [status];
  if (!index) {
    throw new Error (`Unknown status ${status}`);
  }
  return index;
}

function changeStatusNecessary (ascending, refTicket, otherTicket, newStatus) {
  // Trace.log ('reducer.changeStatusNecessary');
  const refOrder   = refTicket.Order   ? refTicket.Order   : 0;
  const otherOrder = otherTicket.Order ? otherTicket.Order : 0;
  const refStatusIndex   = getStatusIndex (newStatus);
  const otherStatusIndex = getStatusIndex (otherTicket.Status);
  if (ascending) {  // pre-dispatched > dispatched > delivered ?
    // Propage changes to older tickets.
    if (newStatus === 'dispatched') {
      // Restricted change to tickets from the same messenger.
      return otherStatusIndex <= refStatusIndex && otherOrder <= refOrder && refTicket.OwnerId === otherTicket.OwnerId;
    } else {
      return otherStatusIndex <= refStatusIndex && otherOrder <= refOrder;
    }
  } else {  // delivered > dispatched > pre-dispatched ?
    // Propage changes to newer tickets.
    return otherStatusIndex >= refStatusIndex && otherOrder >= refOrder;
  }
}

// Change the status of (almost) all tickets, according to subtle business rules.
function setBothStatus (state, flashes, ticket, currentStatus, newStatus, date, time) {
  const ascending = getStatusIndex (currentStatus) < getStatusIndex (newStatus);
  const tickets = getSorteTicketsFromMissionId (state, ticket.MissionId);
  for (var otherTicket of tickets) {
    if (changeStatusNecessary (ascending, ticket, otherTicket, newStatus)) {
      setStatus (state, flashes, otherTicket.id, newStatus, date, time);
    }
  }
}

function cycleTicketStatus (state, id) {
  if (window.document.mock) {
    const flashes = [];
    const warnings = [];
    const result = deepSearchFromId (state, id);
    if (result.kind === 'roadbook') {
      const currentStatus = result.tickets[result.index].Status;
      let newStatus;
      if (currentStatus === 'dispatched') {
        newStatus = 'delivered';
      } else if (currentStatus === 'delivered') {
        newStatus = 'pre-dispatched';
      } else {
        newStatus = 'dispatched';
      }
      setBothStatus (state, flashes, result.ticket, currentStatus, newStatus);
    }
    setMiscs (state, flashes, warnings);
    updateUI ();
  } else {
    electrumDispatch (state, 'CycleTicketStatusCommand', {
      TicketId: id,
    });
  }
  return state;
}

function changeTicketStatus (state, id, newStatus, date, time) {
  if (window.document.mock) {
    const flashes = [];
    const warnings = [];
    const result = deepSearchFromId (state, id);
    if (result.kind === 'roadbook') {
      const currentStatus = result.tickets[result.index].Status;
      setBothStatus (state, flashes, result.ticket, currentStatus, newStatus, date, time);
    }
    setMiscs (state, flashes, warnings);
    updateUI ();
  } else {
    electrumDispatch (state, 'ChangeTicketStatusCommand', {
      TicketId: id,
      Status:   newStatus,
    });
  }
  return state;
}

function swapRoadbookCompacted (state, id) {
  const result = deepSearchFromId (state, id);
  if (result.kind !== 'roadbooks') {
    throw new Error (`Invalid kind ${result.kind}`);
  }
  const roadbook = result.tickets[result.index];
  const x = roadbook.Compacted === 'true';
  roadbook.Compacted = x ? 'false' : 'true';
  result.tickets[result.index] = regen (state, roadbook);
  updateUI ();
  return state;
}

function swapRoadbookShowHidden (state, id) {
  const result = deepSearchFromId (state, id);
  if (result.kind !== 'roadbooks') {
    throw new Error (`Invalid kind ${result.kind}`);
  }
  const roadbook = result.tickets[result.index];
  const x = roadbook.ShowHidden === 'true';
  roadbook.ShowHidden = x ? 'false' : 'true';
  result.tickets[result.index] = regen (state, roadbook);
  return state;
}

function setTrayName (state, id, value, accepted) {
  if (window.document.mock) {
    Enumerable.from (state.Desk).where (tray => tray.id === id).forEach (tray => {
      tray.Name = value;
    });
  } else {
    if (accepted) {
      // If tray name changing has accepted, send changing to electrum.
      electrumDispatch (state, 'SetTrayNameCommand', {
        TrayId: id,
        Name:   value,
      });
    } else {
      // If tray name changing has canceled, simply changed data.
      Enumerable.from (state.Desk).where (tray => tray.id === id).forEach (tray => {
        tray.Name = value;
      });
    }
  }
}

// ------------------------------------------------------------------------------------------

function reducer (state = {}, action = {}) {
  Trace.log (`reducer action.type=${action.type}`);
  switch (action.type) {
    case 'INITIALISE':
      state = initialise (state);
      break;

    case 'DROP':
      state = drop (state, action.fromKind, action.fromIds, action.toId, action.toOwnerId, action.toOwnerKind);
      break;

    case 'SWAP_TICKET_SELECTED':
      state = swapTicketSelected (state, action.id, action.shiftKey);
      break;
    case 'SWAP_TICKET_EXTENDED':
      state = swapTicketExtended (state, action.id);
      break;
    case 'CYCLE_TICKET_STATUS':
      state = cycleTicketStatus (state, action.id);
      break;
    case 'CHANGE_TICKET_STATUS':
      state = changeTicketStatus (state, action.id, action.value, action.date, action.time);
      break;

    case 'SWAP_ROADBOOK_COMPACTED':
      state = swapRoadbookCompacted (state, action.id);
      break;
    case 'SWAP_ROADBOOK_SHOWHIDDEN':
      state = swapRoadbookShowHidden (state, action.id);
      break;

    case 'SET_TRAY_NAME':
      state = setTrayName (state, action.id, action.value, action.accepted);
      break;

    case 'ELECTRUM_DISPATCH':
      electrumDispatch (state, action.oper, action.payload);
      break;
  }
  return state;
}

function ask (state = {}, action = {}) {
  const result = deepSearchFromId (state, action.id);
  switch (action.type) {
    case 'IS_MESSENGER_SHOWHIDDEN':
      return result.ticket.ShowHidden === 'true';

    case 'IS_MESSENGER_COMPACTED':
      return result.ticket.Compacted === 'true';

    case 'IS_TICKET_SELECTED':
      return result.ticket.Selected === 'true';

    case 'IS_TICKET_EXTENDED':
      return result.ticket.Extended === 'true';
  }
  return null;
}

// ------------------------------------------------------------------------------------------

module.exports = {reducer, ask};
