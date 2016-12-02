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

  replaceDesk (deskIndex, tripIndex, tripOrTicketId) {
    window.document.reducer (window.document.data, {
      type:           'REPLACE_DESK',
      deskIndex:      deskIndex,
      tripIndex:      tripIndex,
      tripOrTicketId: tripOrTicketId,
    });
  }

  addDesk (deskIndex, tripIndex, tripOrTicketId) {
    window.document.reducer (window.document.data, {
      type:           'ADD_DESK',
      deskIndex:      deskIndex,
      tripIndex:      tripIndex,
      tripOrTicketId: tripOrTicketId,
    });
  }

  deleteDesk (tripOrTicketId) {
    window.document.reducer (window.document.data, {
      type:           'DELETE_DESK',
      tripOrTicketId: tripOrTicketId,
    });
  }

  addMission (index, tripId) {
    window.document.reducer (window.document.data, {
      type:   'ADD_MISSION',
      index:  index,
      tripId: tripId,
    });
  }

  deleteMission (tripId) {
    window.document.reducer (window.document.data, {
      type:   'DELETE_MISSION',
      tripId: tripId,
    });
  }

  addDispatchTickets (ticketId, messenger, targetIndex) {
    targetIndex = parseInt (targetIndex);
    const t1 = ticketId.substring (0, ticketId.length - 5) + '.pick';
    const t2 = ticketId.substring (0, ticketId.length - 5) + '.drop';
    this.addDispatch (messenger, targetIndex + 0, t1);
    this.addDispatch (messenger, targetIndex + 1, t2);
  }

  createTripTransit1 (source, link) {
    return {
      Link: link,
      Pick: source.Pick,
      Drop:
      {
        PlanedTime: source.Pick.PlanedTime,
        ShortDescription: 'Transit',
        LongDescription: 'Zone de transit à définir',
        Type: 'transit',
      },
      Count: source.Count,
      Weight: source.Weight,
      Price: source.Price,
      Glyphs: source.Glyphs,
      Product: source.Product,
    };
  }

  createTripTransit2 (source, link) {
    return {
      Link: link,
      Pick:
      {
        PlanedTime: source.Drop.PlanedTime,
        ShortDescription: 'Transit',
        LongDescription: 'Zone de transit à définir',
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

  getTrip (tripId) {
    return window.document.data.trips[tripId];
  }

  createTransit (ticketId, tripId, srcMessenger, index, dstMessenger, targetIndex) {
    if (ticketId.endsWith ('.drop')) {
      targetIndex = parseInt (targetIndex);
      const source = this.getTrip (tripId);
      const link = tripId + '.link';
      const trip1 = this.createTripTransit1 (source, link);
      const trip2 = this.createTripTransit2 (source, link);
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
      return tripId2;
    }
  }

  //  If desk contains pick directly following by drop, merge this two elements in one element.
  mergeDeskContent (deskIndex) {
    const tripIds = window.document.data.desk[deskIndex].TripIds;
    for (var i = 0, len = tripIds.length; i < len - 1; i++) {
      const t1 = tripIds[i + 0];
      const t2 = tripIds[i + 1];
      const tripId1 = t1.substring (0, t1.length - 5);
      const tripId2 = t2.substring (0, t1.length - 5);
      const type1 = t1.substring (t1.length - 5, t1.length);
      const type2 = t2.substring (t2.length - 5, t2.length);
      if (tripId1 === tripId2 && type1 === '.pick' && type2 === '.drop') {
        this.replaceDesk (deskIndex, i, tripId1);
        this.deleteDesk (t2);
        return;
      }
    }
  }

  getTripLink (messenger, link) {
    const array = [];
    const ticketIds = window.document.data.dispatch[messenger];
    for (var i = 0, len = ticketIds.length; i < len; i++) {
      const ticketId = ticketIds[i];
      const tripId = ticketId.substring (0, ticketId.length - 5);
      const t = this.getTrip (tripId);
      if (t.Link === link) {
        array.push ({
          ticketId: ticketId,
          tripId:   tripId,
          trip:     t,
        });
      }
    }
    if (array.length === 4) {
      this.deleteDispatch (messenger, array[1].ticketId);
      this.deleteDispatch (messenger, array[2].ticketId);
    }
  }

  //  Delete transit if 4 tickets are linked under the same messenger.
  deleteTransit (messenger, tripId) {
    const trip = this.getTrip (tripId);
    if (trip && trip.Link) {
      this.getTripLink (messenger, trip.Link);
    }
  }

  //  Delete all instances of a trip, into Dispatch and Desk.
  deleteAll (tripId) {
    for (var [shortName, messenger] of Object.entries (window.document.data.dispatch)) {
      this.deleteDispatch (shortName, tripId + '.pick');
      this.deleteDispatch (shortName, tripId + '.drop');
    }
    this.deleteDesk (tripId);
  }

  getIndex (target, sibling, sourceIndex) {
    let targetIndex = -1;
    if (sibling === null) {
      targetIndex = target.children.length - 1;  // if no sibling, use last element
    } else {
      targetIndex = sibling.dataset.index;
      if (sourceIndex && targetIndex > sourceIndex) {
        targetIndex--;  // if target under source, count as if the source was not there
      }
    }
    return targetIndex;
  }

  changeDispatchToDispatch (element, target, source, sibling) {
    const ticketMessenger = element.dataset.messenger;
    const ticketId        = element.dataset.ticketId;
    const tripId          = element.dataset.tripId;
    const index           = element.dataset.index;
    const targetMessenger = target.dataset.messenger;
    const targetIndex     = this.getIndex (target, sibling, index);
    if (ticketMessenger && ticketMessenger !== targetMessenger) {  // move from messenger to a other messenger ?
      const newTripId = this.createTransit (ticketId, tripId, ticketMessenger, index, targetMessenger, targetIndex);
      this.deleteTransit (ticketMessenger, newTripId);
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
    const targetIndex     = this.getIndex (target, sibling);
    this.addDispatchTickets (ticketId, targetMessenger, targetIndex);
    this.deleteMission (tripId);
  }

  changeDeskToDispatch (element, target, source, sibling) {
    const ticketId        = element.dataset.ticketId;
    const tripId          = element.dataset.tripId;
    const targetMessenger = target.dataset.messenger;
    const targetIndex     = this.getIndex (target, sibling);
    const type = ticketId.substring (ticketId.length - 5, ticketId.length);
    if (type === '.pick' || type === '.drop') {
      this.addDispatch (targetMessenger, targetIndex, ticketId);
      this.deleteDesk (ticketId);
    } else {
      this.addDispatchTickets (ticketId, targetMessenger, targetIndex);
      this.deleteDesk (tripId);
    }
  }

  changeDispatchToMissions (element, target, source, sibling) {
    const tripId      = element.dataset.tripId;
    const targetIndex = this.getIndex (target, sibling);
    this.deleteAll (tripId);
    this.addMission (targetIndex, tripId);
  }

  changeMissionsToMissions (element, target, source, sibling) {
    const tripId      = element.dataset.tripId;
    const index       = element.dataset.index;
    const targetIndex = this.getIndex (target, sibling, index);
    this.deleteMission (tripId);
    this.addMission (targetIndex, tripId);
  }

  changeDeskToMissions (element, target, source, sibling) {
    const ticketId    = element.dataset.ticketId;
    const tripId      = element.dataset.tripId;
    const targetIndex = this.getIndex (target, sibling);
    const type = ticketId.substring (ticketId.length - 5, ticketId.length);
    if (type === '.pick' || type === '.drop') {
      this.deleteAll (tripId);
      this.addMission (targetIndex, tripId);
    } else {
      this.deleteDesk (tripId);
      this.addMission (targetIndex, tripId);
    }
  }

  changeDispatchToDesk (element, target, source, sibling) {
    const ticketMessenger = element.dataset.messenger;
    const ticketId        = element.dataset.ticketId;
    const index           = element.dataset.index;
    const deskIndex       = target.dataset.index;
    const targetIndex     = this.getIndex (target, sibling, index);
    this.deleteDispatch (ticketMessenger, ticketId);
    this.addDesk (deskIndex, targetIndex, ticketId);
    this.mergeDeskContent (deskIndex);
  }

  changeMissionsToDesk (element, target, source, sibling) {
    const tripId      = element.dataset.tripId;
    const index       = element.dataset.index;
    const deskIndex   = target.dataset.index;
    const targetIndex = this.getIndex (target, sibling, index);
    this.deleteMission (tripId);
    this.addDesk (deskIndex, targetIndex, tripId);
  }

  changeDeskToDesk (element, target, source, sibling) {
    const targetDeskIndex = target.dataset.index;
    const ticketId        = element.dataset.ticketId;
    const tripId          = element.dataset.tripId;
    const index           = element.dataset.index;
    const targetIndex     = this.getIndex (target, sibling, index);
    const type = ticketId.substring (ticketId.length - 5, ticketId.length);
    if (type === '.pick' || type === '.drop') {
      this.deleteDesk (ticketId);
      this.addDesk (targetDeskIndex, targetIndex, ticketId);
      this.mergeDeskContent (targetDeskIndex);
    } else {
      this.deleteDesk (tripId);
      this.addDesk (targetDeskIndex, targetIndex, tripId);
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
    // const targetType = target.dataset.dragSource;
    // if (targetType === 'dispatch') {
    //   this.changeToDispatch (element, target, source, sibling);
    // } else if (targetType === 'missions') {
    //   this.changeToMissions (element, target, source, sibling);
    // } else if (targetType === 'desk') {
    //   this.changeToDesk (element, target, source, sibling);
    // }
    window.document.reducerDrag (window.document.data.new, {
      type:    'DRAG',
      element: element,
      target:  target,
      source:  source,
      sibling: sibling,
    });
    // window.document.dispatch.forceUpdate ();
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
