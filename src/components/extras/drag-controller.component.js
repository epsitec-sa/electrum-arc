'use strict';

import React from 'react';
import {default as dragula} from 'react-dragula';
// import autoScroll from 'dom-autoscroller';

/******************************************************************************/

export default class DragController extends React.Component {

  constructor (props) {
    super (props);
  }

  changeTrip (trip, targetType, srcType) {
    if (targetType === 'trip-tickets' && srcType === 'trip-box') {
      trip.setKind ('trip-tickets');
    } else if (targetType === 'trip-box' && srcType === 'trip-tickets') {
      trip.setKind ('trip-box');
    } else if (targetType === 'trip-ticket') {
      trip.setKind ('trip-ticket');
    }
  }

  dragBegin (element, source) {
    console.log ('>>>>>>>>>>>>>> DRAG');
    console.dir (element);
    console.dir (source);
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
    console.log ('>>>>>>>>>>>>>> DROP');
    console.dir (element);
    console.dir (target);
    console.dir (source);
    console.dir (sibling);
    const targetType = target.dataset.dragSource;
    const ticketType = element.dataset.ticketType;
    const ticketId   = element.dataset.ticketId;
    const tripId     = element.dataset.tripId;
    if (targetType && ticketType && ticketId && tripId) {
      console.dir (targetType);
      console.dir (ticketType);
      console.dir (ticketId);
      console.dir (tripId);
      window.document.trips[tripId].forEach ((value, key, map) => {
        if (key === ticketId) {
          this.changeTrip (value, targetType, ticketType);
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
