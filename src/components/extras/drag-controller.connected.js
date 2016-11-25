'use strict';

import React from 'react';
import {connect} from 'react-redux';
import {default as dragula} from 'react-dragula';
// import autoScroll from 'dom-autoscroller';

/******************************************************************************/

function mapStateToProps (state) {
  return {
    trips:             state.trips,
    messengers:        state.messengers,
    messengersContent: state.messengersContent,
    tripBoxContent:    state.tripBoxContent,
    glueContent:       state.glueContent,
  };
}

class DragControllerConnected extends React.Component {

  constructor (props) {
    super (props);
  }

  changeToMessengers (trip, ticketMessenger, targetMessenger) {
    trip.setKind ('trip-ticket');
  }

  deleteMessengerTicket (ticketId, messenger) {
    this.props.dispatch ({
      type: 'DELETE_MESSENGER_TICKET',
      ticketId: ticketId,
      messenger: messenger,
    });
  }

  addGlueTicket (tripId) {
    this.props.dispatch ({
      type: 'ADD_GLUE_TICKET',
      tripId: tripId,
    });
  }

  changeToTripTickets (trip) {
    const ticketId  = trip.props['ticket-id'];
    const tripId    = trip.props['trip-id'];
    const messenger = trip.props['messenger'];
    this.deleteMessengerTicket (ticketId, messenger);
    this.addGlueTicket (tripId);
  }

  changeTrip (trip, ticketType, ticketMessenger, targetType, targetMessenger) {
    console.log ('changeTrip ------------');
    if (ticketType === 'trip-ticket' && targetType === 'trip-tickets') {
      this.changeToTripTickets (trip);
    } else if (targetType === 'trip-tickets') {
      trip.setKind ('trip-tickets');
    } else if (targetType === 'trip-box') {
      trip.setKind ('trip-box');
    } else if (targetType === 'trip-ticket') {
      this.changeToMessengers (trip, ticketMessenger, targetMessenger);
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
    const ticketMessenger = element.dataset.messenger;
    const ticketId        = element.dataset.ticketId;
    const tripId          = element.dataset.tripId;
    const targetType      = target.dataset.dragSource;
    const targetMessenger = target.dataset.messenger;
    if (ticketType && ticketId && tripId && targetType) {
      // console.dir (ticketType);
      // console.dir (ticketId);
      // console.dir (tripId);
      // console.dir (targetType);
      window.document.trips[tripId].forEach ((value, key) => {
        if (key === ticketId) {
          this.changeTrip (value, ticketType, ticketMessenger, targetType, targetMessenger);
        }
      });
    }
  }

  initDragula () {
    // Restrict controller with handle constraint or not.
    const controllerName = this.props.name;
    const direction      = this.props.direction;
    const dragHandle     = this.props['drag-handle'];
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
    const dragHandle = this.props['drag-handle'];
    return handle.dataset.dragHandle === dragHandle;
  }

  isInvalid (el) {
    return el.dataset.dragInvalid === 'true' || el.dataset.dragInvalid === true;
  }

  render () {
    const controllerName = this.props.name;

    return (
      <div data-drag-controller = {controllerName} />
    );
  }
}

export default connect (mapStateToProps, null, null, {pure: false}) (DragControllerConnected);
