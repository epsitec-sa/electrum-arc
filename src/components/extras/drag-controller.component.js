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

  addDispatch (ticketId, messenger) {
    window.document.reducer (window.document.data, {
      type:      'ADD_DISPATCH',
      ticketId:  ticketId,
      messenger: messenger,
    });
  }

  deleteDispatch (ticketId, messenger) {
    window.document.reducer (window.document.data, {
      type:      'DELETE_DISPATCH',
      ticketId:  ticketId,
      messenger: messenger,
    });
  }

  addTickets (ticketId, messenger) {
    const t1 = ticketId.substring (0, ticketId.length - 5) + '.pick';
    const t2 = ticketId.substring (0, ticketId.length - 5) + '.drop';
    this.addDispatch (t1, messenger);
    this.addDispatch (t2, messenger);
  }

  deleteDeskTicket (tripId) {
    window.document.reducer (window.document.data, {
      type:   'DELETE_DESK',
      tripId: tripId,
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

  createTransit (tripId, srcMessenger, dstMessenger) {
    const dataTrips = this.getDataTrips ();
    const source = dataTrips[tripId];
    const trip1 = this.createTripTransit1 (source);
    const trip2 = this.createTripTransit2 (source);
    const tripId1 = tripId + '1';
    const tripId2 = tripId + '2';
    delete dataTrips[tripId];
    dataTrips[tripId1] = trip1;
    dataTrips[tripId2] = trip2;
    this.setDataTrips (dataTrips);

    this.deleteMessengerTicket (tripId + '.pick', srcMessenger);
    this.deleteMessengerTicket (tripId + '.drop', srcMessenger);
    this.addMessengerTicket (tripId1 + '.pick', srcMessenger);
    this.addMessengerTicket (tripId1 + '.drop', srcMessenger);
    this.addMessengerTicket (tripId2 + '.pick', dstMessenger);
    this.addMessengerTicket (tripId2 + '.drop', dstMessenger);
  }

  changeToDispatch (trip, ticketMessenger, targetMessenger) {
    trip.setKind ('trip-ticket');
    const ticketId = trip.props['ticket-id'];
    const tripId   = trip.props['trip-id'];
    if (ticketId.endsWith ('.both') && tripId && targetMessenger) {  // move from desk to messengers ?
      this.addTickets (ticketId, targetMessenger);
      this.deleteDeskTicket (tripId);     // remove source if in desk...
      this.deleteMissionTicket (tripId);  // ...or remove source if in box
    } else if (ticketMessenger && ticketMessenger !== targetMessenger) {  // move from messenger to a other messenger ?
      this.createTransit (tripId, ticketMessenger, targetMessenger);
    }
  }

  changeToTripTickets (trip) {
    const ticketId = trip.props['ticket-id'];
    const tripId   = trip.props['trip-id'];
  }

  changeTrip (trip, ticketType, ticketMessenger, targetType, targetMessenger) {
    console.log ('changeTrip ------------');
    if (ticketType === 'dispatch' && targetType === 'desk') {
      this.changeToTripTickets ();
    } else if (targetType === 'desk') {
      trip.setKind ('trip-tickets');
    } else if (targetType === 'missions') {
      trip.setKind ('trip-box');
    } else if (targetType === 'dispatch') {
      this.changeToDispatch (trip, ticketMessenger, targetMessenger);
    }
    trip.updateWarning ();  // update warning if pick is under drop, or reverse
    window.document.dispatch.regen++;
  }

  drop (element, target, source, sibling) {
    const ticketType      = element.dataset.ticketType;
    const ticketMessenger = element.dataset.messenger;
    const ticketId        = element.dataset.ticketId;
    const tripId          = element.dataset.tripId;
    const targetType      = target.dataset.dragSource;
    const targetMessenger = target.dataset.messenger;
    if (ticketType && ticketId && tripId && targetType) {
      window.document.trips[tripId].forEach ((value, key) => {
        if (key === ticketId) {
          this.changeTrip (value, ticketType, ticketMessenger, targetType, targetMessenger);
        }
      });
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
