'use strict';

import React from 'react';
import {default as dragula} from 'react-dragula';
// import autoScroll from 'dom-autoscroller';

/******************************************************************************/

export default class DragController extends React.Component {

  constructor (props) {
    super (props);
  }

  getDataMessengersContent () {
    return window.document.dispatchMessengers.state.dataMessengersContent;
  }

  setDataMessengersContent (value) {
    window.document.dispatchMessengers.setState ( {
      dataMessengersContent: value
    });
  }

  getDataGlueContent () {
    return window.document.dispatchMessengers.state.dataGlueContent;
  }

  setDataGlueContent (value) {
    window.document.dispatchMessengers.setState ( {
      dataGlueContent: value
    });
  }

  addTickets (ticketId, messenger) {
    const t1 = ticketId.substring (0, ticketId.length - 5) + '.pick';
    const t2 = ticketId.substring (0, ticketId.length - 5) + '.drop';
    const dataMessengersContent = this.getDataMessengersContent ();
    const x = dataMessengersContent[messenger];
    x.push (t1);
    x.push (t2);
    this.setDataMessengersContent (dataMessengersContent);
  }

  deleteTickets (tripId) {
    const dataGlueContent = this.getDataGlueContent ();
    for (var glue of dataGlueContent) {
      if (glue.tripId === tripId) {
        glue.tripId = null;
      }
    }
    this.setDataGlueContent (dataGlueContent);
  }

  changeToTripTickets (trip, targetMessenger) {
    trip.setKind ('trip-ticket');
    const ticketId  = trip.props['ticket-id'];
    const tripId    = trip.props['trip-id'];
    if (ticketId.endsWith ('.both') && tripId && targetMessenger) {
      this.addTickets (ticketId, targetMessenger);
      this.deleteTickets (tripId);
    }
  }

  changeTrip (trip, srcType, targetType, targetMessenger) {
    console.log ('changeTrip ------------');
    if (srcType === 'trip-ticket' && targetType === 'trip-tickets') {
      // Nothing to do.
    } else if (targetType === 'trip-tickets') {
      trip.setKind ('trip-tickets');
    } else if (targetType === 'trip-box') {
      trip.setKind ('trip-box');
    } else if (targetType === 'trip-ticket') {
      this.changeToTripTickets (trip, targetMessenger);
    }
    trip.updateWarning ();  // update warning if pick is under drop, or reverse
  }

  dragBegin (element, source) {
    // console.log ('>>>>>>>>>>>>>> DRAG');
    // console.dir (element);
    // console.dir (source);
    // const ticketId = element.dataset.ticketId;
    // const tripId   = element.dataset.tripId;
    // console.dir (ticketId);
    // console.dir (tripId);
    // window.document.trips[tripId].forEach ((value, key, map) => {
    //   if (key === ticketId) {
    //     console.dir (value);
    //     const ticket = value;
    //     ticket.setKind ('trip-box');
    //   }
    // });
  }

  dragEnd (element, target, source, sibling) {
    // console.log ('>>>>>>>>>>>>>> DROP');
    // console.dir (element);
    // console.dir (target);
    // console.dir (source);
    // console.dir (sibling);
    const ticketType      = element.dataset.ticketType;
    const ticketId        = element.dataset.ticketId;
    const tripId          = element.dataset.tripId;
    const targetType      = target.dataset.dragSource;
    const targetMessenger = target.dataset.messenger;
    if (ticketType && ticketId && tripId && targetType) {
      // console.dir (ticketType);
      // console.dir (ticketId);
      // console.dir (tripId);
      // console.dir (targetType);
      window.document.trips[tripId].forEach ((value, key, map) => {
        if (key === ticketId) {
          this.changeTrip (value, ticketType, targetType, targetMessenger);
        }
      });
    }
  }

  initDragula () {
    // Restrict controller with handle constraint or not.
    const controllerName = this.read ('name');
    const direction      = this.read ('direction');
    const dragHandle     = this.read ('drag-handle');
    let drake;
    if (dragHandle) {
      drake = dragula ([], {
        moves:     (el, container, handle) => this.movesWithHandle (handle),
        invalid:   (el, handle) => this.isInvalid (handle),
        direction: direction,
      });
    } else {
      drake = dragula ([], {
        invalid:   (el) => this.isInvalid (el),
        direction: direction,
      });
    }
    drake.on ('drag', (element, source) => this.dragBegin (element, source));
    drake.on ('drop', (element, target, source, sibling) => this.dragEnd (element, target, source, sibling));

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
    containersNodes.forEach (c => drake.containers.push (c));
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
