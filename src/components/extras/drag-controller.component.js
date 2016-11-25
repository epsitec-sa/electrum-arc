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

  getDataTripBoxContent () {
    return window.document.dispatchMessengers.state.dataTripBoxContent;
  }

  setDataTripBoxContent (value) {
    window.document.dispatchMessengers.setState ( {
      dataTripBoxContent: value
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

  getDataTrips () {
    return window.document.dispatchMessengers.state.dataTrips;
  }

  setDataTrips (value) {
    window.document.dispatchMessengers.setState ( {
      dataTrips: value
    });
  }

  getRegen () {
    return window.document.dispatchMessengers.state.regen;
  }

  setRegen (value) {
    window.document.dispatchMessengers.setState ( {
      regen: value
    });
  }

  addMessengerTicket (ticketId, messenger) {
    const dataMessengersContent = this.getDataMessengersContent ();
    const x = dataMessengersContent[messenger];
    x.push (ticketId);
    this.setDataMessengersContent (dataMessengersContent);
  }

  deleteMessengerTicket (ticketId, messenger) {
    const dataMessengersContent = this.getDataMessengersContent ();
    const x = dataMessengersContent[messenger];
    const i = x.indexOf (ticketId);
    x.splice (i, 1);
    this.setDataMessengersContent (dataMessengersContent);
  }

  addTickets (ticketId, messenger) {
    const t1 = ticketId.substring (0, ticketId.length - 5) + '.pick';
    const t2 = ticketId.substring (0, ticketId.length - 5) + '.drop';
    this.addMessengerTicket (t1, messenger);
    this.addMessengerTicket (t2, messenger);
  }

  deleteGlueTicket (tripId) {
    const dataGlueContent = this.getDataGlueContent ();
    for (var glue of dataGlueContent) {
      if (glue.tripId === tripId) {
        delete glue.tripId;
      }
    }
    this.setDataGlueContent (dataGlueContent);
  }

  deleteTripBoxTicket (tripId) {
    const dataTripBoxContent = this.getDataTripBoxContent ();
    const i = dataTripBoxContent.indexOf (tripId);
    dataTripBoxContent.splice (i, 1);
    this.setDataTripBoxContent (dataTripBoxContent);
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

  changeToMessengers (trip, ticketMessenger, targetMessenger) {
    trip.setKind ('trip-ticket');
    const ticketId = trip.props['ticket-id'];
    const tripId   = trip.props['trip-id'];
    if (ticketId.endsWith ('.both') && tripId && targetMessenger) {  // move from glue to messengers ?
      this.addTickets (ticketId, targetMessenger);
      this.deleteGlueTicket (tripId);     // remove source if in glue...
      this.deleteTripBoxTicket (tripId);  // ...or remove source if in box
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
    if (ticketType === 'trip-ticket' && targetType === 'trip-tickets') {
      this.changeToTripTickets ();
    } else if (targetType === 'trip-tickets') {
      trip.setKind ('trip-tickets');
    } else if (targetType === 'trip-box') {
      trip.setKind ('trip-box');
    } else if (targetType === 'trip-ticket') {
      this.changeToMessengers (trip, ticketMessenger, targetMessenger);
    }
    trip.updateWarning ();  // update warning if pick is under drop, or reverse
    // this.setRegen (this.getRegen () + 1);
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
