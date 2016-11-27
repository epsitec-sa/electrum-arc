'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {TripBox, TripTicket, TripTickets} from '../../all-components.js';

/******************************************************************************/

export default class Trip extends React.Component {

  constructor (props) {
    super (props);
  }

  componentDidMount () {
    const inputTicketId = this.read ('ticket-id');
    const inputTripId   = this.read ('trip-id');
    if (inputTicketId && inputTripId) {
      if (!window.document.trips) {
        window.document.trips = {};
      }
      if (!window.document.trips[inputTripId]) {
        window.document.trips[inputTripId] = new Map ();
      }
      window.document.trips[inputTripId].set (inputTicketId, this);
    }
  }

  componentWillUnmount () {
    const inputTicketId = this.read ('ticket-id');
    const inputTripId   = this.read ('trip-id');
    if (inputTicketId && inputTripId) {
      if (!window.document.trips) {
        throw new Error (`Fatal error during Trip.componentWillUnmount with tripId=${inputTripId} (#1)`);
      }
      if (!window.document.trips[inputTripId]) {
        throw new Error (`Fatal error during Trip.componentWillUnmount tripId=${inputTripId} (#2)`);
      }
      window.document.trips[inputTripId].delete (inputTicketId);
    }
  }

  render () {
    const kind      = this.read ('kind');
    const data      = this.read ('data');
    const tripId    = this.read ('trip-id');
    const ticketId  = this.read ('ticket-id');
    const messenger = this.read ('messenger');

    if (kind === 'trip-box') {
      return (
        <TripBox data={data} ticket-id={ticketId} trip-id={tripId}
          {...this.link ()} />
      );
    } else if (kind === 'trip-tickets') {
      return (
        <TripTickets data={data} ticket-id={ticketId} trip-id={tripId}
          {...this.link ()} />
      );
    } else if (kind === 'trip-ticket') {
      return (
        <TripTicket data={data} ticket-id={ticketId} trip-id={tripId}
          messenger={messenger} {...this.link ()} />
      );
    } else {
      throw new Error (`Trip component contains invalid kind: ${kind}`);
    }
  }
}

/******************************************************************************/
