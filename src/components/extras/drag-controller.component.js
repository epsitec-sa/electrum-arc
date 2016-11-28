'use strict';

import React from 'react';
import {default as dragula} from 'react-dragula';
// import autoScroll from 'dom-autoscroller';

/******************************************************************************/

export default class DragController extends React.Component {

  constructor (props) {
    super (props);
    this.drake = null;
  }

  addTrip (tripId, trip) {
    window.document.reducer (window.document.data, {
      type:   'ADD_TRIP',
      tripId: tripId,
      trip:   trip,
    });
  }

  deleteTrip (tripId) {
    window.document.reducer (window.document.data, {
      type:   'DELETE_TRIP',
      tripId: tripId,
    });
  }

  replaceDispatch (messenger, index, ticketId) {
    window.document.reducer (window.document.data, {
      type:      'REPLACE_DISPATCH',
      messenger: messenger,
      index:     index,
      ticketId:  ticketId,
    });
  }

  addDispatch (messenger, index, ticketId) {
    window.document.reducer (window.document.data, {
      type:      'ADD_DISPATCH',
      messenger: messenger,
      index:     index,
      ticketId:  ticketId,
    });
  }

  deleteDispatch (messenger, ticketId) {
    window.document.reducer (window.document.data, {
      type:      'DELETE_DISPATCH',
      messenger: messenger,
      ticketId:  ticketId,
    });
  }

  addTickets (ticketId, messenger, targetIndex) {
    targetIndex = parseInt (targetIndex);
    const t1 = ticketId.substring (0, ticketId.length - 5) + '.pick';
    const t2 = ticketId.substring (0, ticketId.length - 5) + '.drop';
    this.addDispatch (messenger, targetIndex + 0, t1);
    this.addDispatch (messenger, targetIndex + 1, t2);
  }

  addDeskTicket (deskIndex, tripIndex, tripOrTicketId) {
    window.document.reducer (window.document.data, {
      type:           'ADD_DESK',
      deskIndex:      deskIndex,
      tripIndex:      tripIndex,
      tripOrTicketId: tripOrTicketId,
    });
  }

  deleteDeskTicket (tripOrTicketId) {
    window.document.reducer (window.document.data, {
      type:           'DELETE_DESK',
      tripOrTicketId: tripOrTicketId,
    });
  }

  deleteMissionTicket (tripId) {
    window.document.reducer (window.document.data, {
      type:   'DELETE_MISSION',
      tripId: tripId,
    });
  }

  createTripTransit1 (source) {
    return {
      Pick: source.Pick,
      Drop:
      {
        Time: source.Pick.Time,
        Description: 'Transit',
        Details: 'Zone de transit à définir',
        Type: 'transit',
      },
      Count: source.Count,
      Weight: source.Weight,
      Price: source.Price,
      Glyphs: source.Glyphs,
      Product: source.Product,
    };
  }

  createTripTransit2 (source) {
    return {
      Pick:
      {
        Time: source.Drop.Time,
        Description: 'Transit',
        Details: 'Zone de transit à définir',
        Type: 'transit',
      },
      Drop: source.Drop,
      Count: source.Count,
      Weight: source.Weight,
      Price: source.Price,
      Glyphs: source.Glyphs,
      Product: source.Product,
    };
  }

  createTransit (ticketId, tripId, srcMessenger, index, dstMessenger, targetIndex) {
    if (ticketId.endsWith ('.drop')) {
      targetIndex = parseInt (targetIndex);
      const source = window.document.data.trips[tripId];
      const trip1 = this.createTripTransit1 (source);
      const trip2 = this.createTripTransit2 (source);
      const tripId1 = tripId + '1';
      const tripId2 = tripId + '2';
      this.deleteTrip (tripId);
      this.addTrip (tripId1, trip1);
      this.addTrip (tripId2, trip2);

      const i = window.document.data.dispatch[srcMessenger].indexOf (tripId + '.pick');
      this.replaceDispatch (srcMessenger, i, tripId1 + '.pick');
      this.replaceDispatch (srcMessenger, index, tripId1 + '.drop');
      this.addDispatch (dstMessenger, targetIndex + 0, tripId2 + '.pick');
      this.addDispatch (dstMessenger, targetIndex + 1, tripId2 + '.drop');
    }
  }

  changeDispatchToDispatch (element, target, source, sibling) {
    const ticketMessenger = element.dataset.messenger;
    const ticketId        = element.dataset.ticketId;
    const tripId          = element.dataset.tripId;
    const index           = element.dataset.index;
    const targetMessenger = target.dataset.messenger;
    let targetIndex = -1;
    if (sibling === null) {
      targetIndex = target.children.length - 1;  // if no sibling, use last element
    } else {
      targetIndex = sibling.dataset.index;
      if (targetIndex > index) {
        targetIndex--;  // if target under source, count as if the source was not there
      }
    }
    if (ticketMessenger && ticketMessenger !== targetMessenger) {  // move from messenger to a other messenger ?
      this.createTransit (ticketId, tripId, ticketMessenger, index, targetMessenger, targetIndex);
    } else {  // move into a messenger ?
      if (ticketMessenger === targetMessenger && targetIndex !== -1) {
        this.deleteDispatch (ticketMessenger, ticketId);
        this.addDispatch (ticketMessenger, targetIndex, ticketId);
      }
    }
  }

  changeMissionsToDispatch (element, target, source, sibling) {
    const ticketId        = element.dataset.ticketId;
    const tripId          = element.dataset.tripId;
    const targetMessenger = target.dataset.messenger;
    let targetIndex = -1;
    if (sibling === null) {
      targetIndex = target.children.length - 1;  // if no sibling, use last element
    } else {
      targetIndex = sibling.dataset.index;
    }
    this.addTickets (ticketId, targetMessenger, targetIndex);
    this.deleteMissionTicket (tripId);
  }

  changeDeskToDispatch (element, target, source, sibling) {
    const ticketId        = element.dataset.ticketId;
    const tripId          = element.dataset.tripId;
    const targetMessenger = target.dataset.messenger;
    let targetIndex = -1;
    if (sibling === null) {
      targetIndex = target.children.length - 1;  // if no sibling, use last element
    } else {
      targetIndex = sibling.dataset.index;
    }
    const type = ticketId.substring (ticketId.length - 5, ticketId.length);
    if (type === '.pick' || type === '.drop') {
      this.addDispatch (targetMessenger, targetIndex, ticketId);
      this.deleteDeskTicket (ticketId);
    } else {
      this.addTickets (ticketId, targetMessenger, targetIndex);
      this.deleteDeskTicket (tripId);
    }
  }

  changeDispatchToMissions (element, target, source, sibling) {
  }

  changeMissionsToMissions (element, target, source, sibling) {
  }

  changeDeskToMissions (element, target, source, sibling) {
  }

  changeDispatchToDesk (element, target, source, sibling) {
    const ticketMessenger = element.dataset.messenger;
    const ticketId        = element.dataset.ticketId;
    const index           = element.dataset.index;
    const deskIndex       = target.dataset.index;
    let targetIndex = -1;
    if (sibling === null) {
      targetIndex = target.children.length - 1;  // if no sibling, use last element
    } else {
      targetIndex = sibling.dataset.index;
      if (targetIndex > index) {
        targetIndex--;  // if target under source, count as if the source was not there
      }
    }
    this.deleteDispatch (ticketMessenger, ticketId);
    this.addDeskTicket (deskIndex, targetIndex, ticketId);
  }

  changeMissionsToDesk (element, target, source, sibling) {
    const tripId    = element.dataset.tripId;
    const index     = element.dataset.index;
    const deskIndex = target.dataset.index;
    let targetIndex = -1;
    if (sibling === null) {
      targetIndex = target.children.length - 1;  // if no sibling, use last element
    } else {
      targetIndex = sibling.dataset.index;
      if (targetIndex > index) {
        targetIndex--;  // if target under source, count as if the source was not there
      }
    }
    this.deleteMissionTicket (tripId);
    this.addDeskTicket (deskIndex, targetIndex, tripId);
  }

  changeDeskToDesk (element, target, source, sibling) {
    const targetDeskIndex = target.dataset.index;
    const ticketId        = element.dataset.ticketId;
    const tripId          = element.dataset.tripId;
    const index           = element.dataset.index;
    let targetIndex = -1;
    if (sibling === null) {
      targetIndex = target.children.length - 1;  // if no sibling, use last element
    } else {
      targetIndex = sibling.dataset.index;
      if (targetIndex > index) {
        targetIndex--;  // if target under source, count as if the source was not there
      }
    }
    const type = ticketId.substring (ticketId.length - 5, ticketId.length);
    if (type === '.pick' || type === '.drop') {
      this.deleteDeskTicket (ticketId);
      this.addDeskTicket (targetDeskIndex, targetIndex, ticketId);
    } else {
      this.deleteDeskTicket (tripId);
      this.addDeskTicket (targetDeskIndex, targetIndex, tripId);
    }
  }

  changeToDispatch (element, target, source, sibling) {
    const sourceType = source.dataset.dragSource;
    if (sourceType === 'dispatch') {
      this.changeDispatchToDispatch (element, target, source, sibling);
    } else if (sourceType === 'missions') {
      this.changeMissionsToDispatch (element, target, source, sibling);
    } else if (sourceType === 'desk') {
      this.changeDeskToDispatch (element, target, source, sibling);
    }
  }

  changeToMissions (element, target, source, sibling) {
    const sourceType = source.dataset.dragSource;
    if (sourceType === 'dispatch') {
      this.changeDispatchToMissions (element, target, source, sibling);
    } else if (sourceType === 'missions') {
      this.changeMissionsToMissions (element, target, source, sibling);
    } else if (sourceType === 'desk') {
      this.changeDeskToMissions (element, target, source, sibling);
    }
  }

  changeToDesk (element, target, source, sibling) {
    const sourceType = source.dataset.dragSource;
    if (sourceType === 'dispatch') {
      this.changeDispatchToDesk (element, target, source, sibling);
    } else if (sourceType === 'missions') {
      this.changeMissionsToDesk (element, target, source, sibling);
    } else if (sourceType === 'desk') {
      this.changeDeskToDesk (element, target, source, sibling);
    }
  }

  drop (element, target, source, sibling) {
    console.log ('>>>>> drop >>>>>');
    const targetType = target.dataset.dragSource;
    if (targetType === 'dispatch') {
      this.changeToDispatch (element, target, source, sibling);
    } else if (targetType === 'missions') {
      this.changeToMissions (element, target, source, sibling);
    } else if (targetType === 'desk') {
      this.changeToDesk (element, target, source, sibling);
    }
  }

  initDragula () {
    // Restrict controller with handle constraint or not.
    const controllerName = this.read ('name');
    const direction      = this.read ('direction');
    const dragHandle     = this.read ('drag-handle');
    if (dragHandle) {
      this.drake = dragula ([], {
        moves:     (el, container, handle) => this.movesWithHandle (handle),
        invalid:   (el, handle) => this.isInvalid (handle),
        direction: direction,
      });
    } else {
      this.drake = dragula ([], {
        invalid:   (el) => this.isInvalid (el),
        direction: direction,
      });
    }
    this.drake.on ('drop', (element, target, source, sibling) => this.drop (element, target, source, sibling));
    // this.drake.on ('dragEnd', () => console.log ('dragEnd'));
    // this.drake.on ('remove', () => console.log ('remove'));
    // this.drake.on ('shadow', () => console.log ('shadow'));
    // this.drake.on ('over', () => console.log ('over'));
    // this.drake.on ('out', () => console.log ('out'));
    // this.drake.on ('cloned', () => console.log ('cloned'));

    // Configure auto-scroll
    /*autoScroll ([
      document.querySelectorAll (`[data-drag-controller="${controllerName}"]`)
      ], {
      margin: 20,
      maxSpeed: 5,
      scrollWhenOutside: true,
      autoScroll: function () {
          //Only scroll when the pointer is down, and there is a child being dragged.
          return this.down && drake.dragging;
        }
    });*/

    // find and add existing containers in dom
    const containersNodes = document.querySelectorAll (`[data-drag-container-for="${controllerName}"]`);
    containersNodes.forEach (c => this.drake.containers.push (c));
  }

  componentDidMount () {
    this.initDragula ();
  }

  movesWithHandle (handle) {
    const dragHandle = this.read ('drag-handle');
    return handle.dataset.dragHandle === dragHandle;
  }

  isInvalid (el) {
    return el.dataset.dragInvalid === 'true' || el.dataset.dragInvalid === true;
  }

  render () {
    const controllerName = this.read ('name');

    return (
      <div data-drag-controller = {controllerName} />
    );
  }
}

/******************************************************************************/
